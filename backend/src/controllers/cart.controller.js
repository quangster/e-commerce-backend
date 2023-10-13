'use strict'

const CartService = require("../services/cart.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const CartController = {
    addToCart: async(req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
            message: "Create new Cart Successful",
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    },

    // update + -
    update : async(req, res, next) => {
        new SuccessResponse({
            message: "Add product to Cart Successful",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res);
    },

    delete : async(req, res, next) => {
        new SuccessResponse({
            message: "delete cart successful",
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res);
    },

    list : async(req, res, next) => {
        new SuccessResponse({
            message: "Get List Successful",
            metadata: await CartService.getListUserCart(req.query)
        }).send(res);
    },
}

module.exports = CartController