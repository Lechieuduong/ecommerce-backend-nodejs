'use strict'

const JWT = require('jsonwebtoken');

const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION : 'authorization'
}

const asyncHandler = require('../helpers/asyncHelper');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify`, err);
            } else {
                console.log(`decode verify`, decode);
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /**
     * 1. Check userId missing???
     * 2. Get accessToken
     * 3. verifyToken
     * 4. check user in bds?
     * 5. check keyStore with this userId
     * Ok all => return next()
     */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found Key Store');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserID')
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}