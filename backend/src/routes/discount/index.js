"use strict";

const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler')

const { authentication } = require('../../auth/authUtils')

// get amount a discount
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
// get all discount
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProducts))

router.use(authentication)

router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodes))

module.exports = router;