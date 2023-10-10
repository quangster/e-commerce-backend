'use strict'

const DiscountService = require("../services/discount.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const DiscountController = {

    createDiscountCode: async(req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Generator",
            metadata: await DiscountService.createDiscountCode({
                ...req.body, 
                shopId: req.user.userId
            })
        }).send(res);
    },

    getAllDiscountCodes: async(req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Found",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query, 
                shopId: req.user.userId
            })
        }).send(res);
    },

    getDiscountAmount: async(req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Found",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    },

    getAllDiscountCodeWithProducts: async(req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Found",
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res);
    },
}

module.exports = DiscountController