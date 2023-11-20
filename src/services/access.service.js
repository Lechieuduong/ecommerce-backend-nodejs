
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN'
};

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step1: check email exists?
            // lean giảm tải size của object
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    code: xxx,
                    message: 'Shop already registered!'
                }
            }
            
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name, email, password, passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // create privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    moduleLength: 4096
                });

                console.log({ privateKey, publicKey });
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