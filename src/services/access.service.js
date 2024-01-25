
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('../services/shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
};

class AccessService {
    static logout = async({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey; 
    }
    /**
     * 1 - Check email in db
     * 2 - Match password
     * 3 - Create AT vs RT and save
     * 4 - Generate tokens
     * 5 - Get data and return login
     */
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!');
        }

        const isMatch = bcrypt.compare(password, foundShop.password)
        if (!isMatch) throw AuthFailureError('Authentication Error')
        
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], objects: foundShop}),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // step1: check email exists?
        // lean giảm tải size của object
        const holderShop = await shopModel.findOne({ email }).lean();

        if (holderShop) {
            throw new BadRequestError('Shop aleady registered!');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password, passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            // create privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         // Public key CryptoGraphy Standards
            //         format: 'pem'
            //         // sử dụng để mã hóa dữ liệu nhị phân
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         // Public key CryptoGraphy Standards
            //         format: 'pem'
            //         // sử dụng để mã hóa dữ liệu nhị phân
            //     }
            // });

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({ privateKey, publicKey });

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore Error'
                }
            }

            // const publicKeyObject = crypto.createPublicKey(publicKeyString);
            // console.log(`publicKeyObject:::`, publicKeyObject);


            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], objects: newShop}),
                    tokens
                }
            }
        }
        return {
            code: 200, 
            meatadata: null
        }
    }
}

module.exports = AccessService