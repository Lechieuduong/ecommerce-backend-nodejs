'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString()
            const token = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })

            return token ? publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService