'use strict'

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const AccessController = {
    register: async(req, res, next) => {
        new CREATED({
            message: "Register OK !!!",
            metadata: await AccessService.register(req.body),
        }).send(res);
    }
}

module.exports = AccessController