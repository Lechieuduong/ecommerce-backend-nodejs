'use strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const { findById } = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error',
            })
        }
        // check apiKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({  
                message: 'Forbidden Error',
            })
        }
        req.objKey = objKey;
        return next();
    } catch (error) {

    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        console.log(req.objKey.permissions);
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied',
            });
        }

        console.log('permissions::', req.objKey.permissions)
        const validPermissions = req.objKey.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(403).json({
                message: 'Permission Denied',
            }); 
        }
        return next();
    }
}

module.exports = {
    apiKey, 
    checkPermission
}