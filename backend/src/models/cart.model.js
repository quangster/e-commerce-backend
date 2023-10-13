'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'complete', 'failed', 'pending'],
        default: 'active',
    },
    cart_products: {
        type: Array, required: true, default: [],
    },
    /*
    [{
        productId,
        shopId,
        quantity,
        name,
        price,
    }]
    */
    cart_count_product: {type: Number, default: 0},
    cart_userId: {type: Number, required: true},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, cartSchema)