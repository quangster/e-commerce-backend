'use strict'

const express = require("express");
const CheckoutController = require("../../controllers/checkout.controller");
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler')

const { authentication } = require('../../auth/authUtils')

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router;