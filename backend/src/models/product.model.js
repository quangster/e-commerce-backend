'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = "Products";
const COLLECTION_NAME = "Products";

const productSchema = new Schema({
    product_name: { type: Schema.Types.String, required: true},
    product_thumb: { type: Schema.Types.String, required: true},
    product_description: { type: Schema.Types.String },
    product_price: { type: Schema.Types.Number, required: true},
    product_quantity: { type: Schema.Types.Number, required: true},
    product_type: { 
        type: Schema.Types.String, 
        required: true, 
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'},
    product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})


// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: Schema.Types.String, required: true},
    size: { type: Schema.Types.String},
    material: { type: Schema.Types.String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'},
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: { type: Schema.Types.String, required: true},
    model: { type: Schema.Types.String},
    color: { type: Schema.Types.String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'},
}, {
    collection: 'electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: { type: Schema.Types.String, required: true},
    size: { type: Schema.Types.String},
    material: { type: Schema.Types.String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'},
}, {
    collection: 'furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothings', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furnitures', furnitureSchema),
}