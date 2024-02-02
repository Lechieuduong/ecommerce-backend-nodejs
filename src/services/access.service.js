
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { BadRequestError, AuthFailureError, ForbiddenError} = require('../core/error.response');
const { findByEmail } = require('../services/shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
};

class AccessService {

    /**
     * Check token used
     */
    static handleRefreshToken = async (refreshToken) => {
        // Check xem token này đã được sử dụng chưa
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // Nếu có
        if(foundToken) {
            // Decode ra xem mày là thằng nào
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            // Xóa tất cả token trong key store
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something went wrong! Please Re-login');
        }

        // No bở qua
        const holdToken = await KeyTokenService.findByRefreshToken({refreshToken});
        if(holdToken) throw new AuthFailureError('Shop not registered')

        const { userId, email } = await verifyJWT(refreshToken, holdToken.privateKey);
        // check UserID
        const foundShop = await findByEmail(email);
        if(!foundShop) throw new AuthFailureError('Shop not registered')

        // create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, holdToken.publicKey, holdToken.privateKey);

        // update token
        await holdToken.update({
            $set: {
                refreshToken: token.refreshToken
            }, 
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }

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