`use strict`;
const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require('../core/success.response');
class AccessController {
    handleRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token Success',
        //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res)

        // v2
        new SuccessResponse({
            message: 'Get token Success',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout({ keyStore: req.keyStore})
        })
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    }
}

module.exports = new AccessController()