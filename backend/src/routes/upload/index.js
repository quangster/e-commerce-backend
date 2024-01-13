"use strict";

const express = require("express");
const UploadController = require("../../controllers/upload.controller");
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler')
// const { authentication } = require('../../auth/authUtils')

// router.use(authentication)

router.post('/product', asyncHandler(UploadController.uploadImageFromURL))

module.exports = router;