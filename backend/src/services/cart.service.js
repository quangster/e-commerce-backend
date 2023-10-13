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
const {
    getProductById,
} = require('../models/repositories/product.repo')
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
    },

    // update cart
    /*
        shop_order_ids: 
        [{
            shopId,
            item_products: 
            [{
                quantity,
                price,
                shopId,
                old_quantity,
                productId,
            }],
            version
        }]
    */
    addToCartV2: async({userId, shop_order_ids = []}) => {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not found')
        // compare 
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
            throw new BadRequestError('Shop and Product not match')
        }
        if (quantity === 0) {
            // delete product from cart
        }
        return await updateUserCartQuantity({userId, product: {
            productId,
            quantity: quantity - old_quantity,
        }})
    },

    deleteUserCart: async({ userId, productId }) => {
        const query = { cart_userId: userId, cart_state: 'active' }
        const updateSet = {
            $pull: {
                cart_products: { productId }
            }
        }
        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart
    },

    getListUserCart: async({userId}) => {
        return await cartModel.findOne({
            cart_userId: +userId,
        }).lean()
    }

}

module.exports = CartService