'use strict'

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const AccessController = {

    handlerRefreshToken: async (req, res, next) => {
        new SuccessResponse({
            message: "get token OK!",
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            }),
        }).send(res);
    },

    register: async(req, res, next) => {
        new CREATED({
            message: "Register OK !!!",
            metadata: await AccessService.register(req.body),
            options: {
                limit: 10,
            }
        }).send(res);
    },

    login: async(req, res, next) => {
        new SuccessResponse({
            message: "Login OK !!!",
            metadata: await AccessService.login(req.body),
        }).send(res);
    },

    logout: async(req, res, next) => {
        new SuccessResponse({
            message: "Logout OK !!!",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    }
}

module.exports = AccessController