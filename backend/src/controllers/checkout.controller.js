'use strict'

const CheckoutService = require("../services/checkout.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const CheckoutController = {

    checkoutReview: async(req, res, next) => {
        new SuccessResponse({
            message: "Checkout Success",
            metadata: await CheckoutService.checkoutReview(req.body),
        }).send(res);
    },

}

module.exports = CheckoutController