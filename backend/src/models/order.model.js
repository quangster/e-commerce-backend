'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {}},
    /*  
        order_checkout = {
            totalProct,
            totalApplyDiscount,
            totalfeeShip,
        }
    */
    order_shipping: { type: Object, default: {}}, 
    /*
        street,
        city,
        state,
        country,
    */    
    order_payment: { type: Object, default: {}},
    order_products: { type: Array, required: true},
    order_trackingNumber: { type: String, default: '#0000118052023'},
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, orderSchema)