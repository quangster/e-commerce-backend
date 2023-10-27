'use strict'

const { inventory } = require('../models/inventory.model')
const { BadRequestError, } = require('../core/error.response')
const { getProductById } = require('../models/repositories/product.repo')

const InventoryService = {
    addStockToInventory: async({ 
        stock, 
        productId, 
        shopId, 
        location = '134 Tran Phu, Hai Phong City' }) => {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('The product does not exists!')
        const query = {
            inven_shopId: shopId,
            inven_productId: productId,
        }, updateSet = {
            $inc: {
                inventory_stock: stock,
            },
            $set: {
                inven_location: location,
            }
        }, options = {
            upsert: true, 
            new: true,
        }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    },

}

module.exports = InventoryService