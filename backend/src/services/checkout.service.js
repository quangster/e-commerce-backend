'use strict'

const {
    findCartById,
} = require('../models/repositories/cart.repo')
const {
    getDiscountAmount,
} = require('../services/discount.service')
const { 
    BadRequestError,
    NotFoundError,
} = require('../core/error.response')
const {
    checkProductByServer,
} = require('../models/repositories/product.repo')
const { acquireLock, releaseLock } = require('./redis.service')
const orderModel = require('../models/order.model')

const CheckoutService = {

    /*
        {
            cartId,
            userId,
            shop_order_ids: [{
                shopId,
                shop_discounts: [{
                    "shopId",
                    "discountId",
                    codeId: 
                }],
                item_products: [{
                    price,
                    quantity,
                    productId,
                }]
            }]
            
        }
    */
    checkoutReview: async({
        cartId, userId, shop_order_ids = []
    }) => {
        // check exist cart
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new NotFoundError('Cart not found')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId, shop_discounts = [], item_products = []
            } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)

            // total checkout
            // if (!checkProductByServer[0]) throw new BadRequestError('order wrong!!')
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            // neu shop_discounts ton tai > 0, check xem co hop le khong
            if (shop_discounts.length > 0) {
                // get amount discount
                const {
                    totalPrice = 0,
                    discount = 0,
                } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                })

                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // total checkout
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }
    },

    order: async({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) => {
        const {
            shop_order_ids_new,
            checkout_order
        } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids,
        })

        // check lai mot lan nua xem vuot ton kho hay khong
        // get new array product
        const products = shop_order_ids_new.flatMap( order => order.item_products)
        console.log(`[1]::`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check if co 1 san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang de biet tham chi tiet...')
        }

        // TODO
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        // neu insert success thi remove product co trong cart
        if (newOrder) {

        }

        return new Order
    },

    /* 
        1> Query Orders [User]
    */
    getOrdersByUser: async() => {

    },

    /* 
        1> Query Order Using Id [User]
    */
    getOneOrderByUser: async() => {

    },

    /* 
        1> Cancel Order [User]
    */
    cancelOrderByUser: async() => {

    },

    /* 
        1> Update Order Status [Shop | Admin]
    */
    updateOrderStatusByShop: async() => {

    },
}

module.exports = CheckoutService