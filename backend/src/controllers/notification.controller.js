'use strict'

const {
    getListNotiByUser
} = require("../services/notification.service");

const { CREATED, SuccessResponse } = require('../core/success.response')

const NotificationController = {

    getListNotiByUser: async(req, res, next) => {
        new SuccessResponse({
            message: "get list notification success",
            metadata: await getListNotiByUser(req.query)
        }).send(res);
    },
    
}

module.exports = NotificationController