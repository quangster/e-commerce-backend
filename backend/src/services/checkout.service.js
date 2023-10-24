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
    }
}

module.exports = CheckoutService