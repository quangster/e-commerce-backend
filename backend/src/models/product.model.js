'use strict'

const { model, Schema } = require('mongoose')
const slugify = require('slugify')
const DOCUMENT_NAME = "Products"
const COLLECTION_NAME = "Products"

const productSchema = new Schema({
    product_name: { type: Schema.Types.String, required: true},
    product_thumb: { type: Schema.Types.String, required: true},
    product_description: { type: Schema.Types.String },
    product_slug: { type: Schema.Types.String },
    product_price: { type: Schema.Types.Number, required: true},
    product_quantity: { type: Schema.Types.Number, required: true},
    product_type: { 
        type: Schema.Types.String, 
        required: true, 
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'},
    product_attributes: { type: Schema.Types.Mixed, required: true },
    // more 
    product_ratingsAverage: {
        type: Schema.Types.Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: [],
    },
    isDraft: { type: Boolean, default: true, index: true, select: false},
    isPublished: { type: Boolean, default: false, index: true, select: false},
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})

// Create index for search product
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
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