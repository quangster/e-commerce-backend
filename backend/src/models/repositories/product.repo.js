'use strict'

const { product, clothing, electronic, furniture } = require('../product.model')
const { Types } = require('mongoose')

const queryProduct = async({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const findAllDraftsForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
            isPublished: true,
            $text: { $search: regexSearch }
        }, { 
            score: {$meta: 'textScore'}
        }).sort({ 
            score: {$meta: 'textScore'}
        }).lean()
    return results
}


const publishProductByShop = async({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublished = true
    var modifiedCount = 0;
    await foundShop.save().then(savedShop => {
        if (savedShop === foundShop) {
            modifiedCount = 1;
        }
    })
    return modifiedCount
}

const unPublishProductByShop = async({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    var modifiedCount = 0;
    await foundShop.save().then(savedShop => {
        if (savedShop === foundShop) {
            modifiedCount = 1;
        }
    })
    return modifiedCount
}


module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllPublishForShop,
    searchProductByUser
}