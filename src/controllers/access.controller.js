`use strict`;
const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require('../core/success.response');
class AccessController {
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout({ keyStore: req.keyStore})
        })
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        })
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