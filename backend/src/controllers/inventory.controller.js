'use strict'

const InventoryService = require("../services/inventory.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const InventoryController = {

    addStockToInventory: async(req, res, next) => {
        new SuccessResponse({
            message: "Successful addStockToInventory",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res);
    },
}

module.exports = InventoryController