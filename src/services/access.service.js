
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check email exists?
            // lean giảm tải size của object
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
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
                        message: 'ketStore Error'
                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString);
                // console.log(`publicKeyObject:::`, publicKeyObject);


                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                console.log('Created Token Success', tokens);

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
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService