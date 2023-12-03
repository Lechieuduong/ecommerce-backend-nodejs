'use strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.header[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error',
            })
        }
    } catch (error) {
        
    }
}