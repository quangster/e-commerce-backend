'use strict'

const cartModel = require('../models/cart.model')
const { 
    BadRequestError,
    NotFoundError,
} = require('../core/error.response')
const { 
    createUserCart,
    updateUserCartQuantity,
} = require('../models/repositories/cart.repo')

/* 
    Key features: Cart Service
    - add product to cart [User]
    - reduce product quantity by one [User]
    - increase product quantity by one [User]
    - get Cart [User]
    - Delete cart [User]
    - Delete cart item [User]
*/

const CartService = {
    addToCart: async({userId, product = {}}) => {
        // check exist cart
        const userCart = await cartModel.findOne({cart_userId: userId}).lean()
        if (!userCart) {
            // create cart for User
            return await createUserCart({ userId, product })
        }
        if (userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        return await updateUserCartQuantity({ userId, product })
    }
}

module.exports = CartService