"use strict";

const express = require("express");
const UploadController = require("../../controllers/upload.controller");
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler')
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')
// const { authentication } = require('../../auth/authUtils')

// router.use(authentication)

router.post('/product', asyncHandler(UploadController.uploadImageFromURL))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadImageFromLocal))
router.post('/product/multiple', uploadDisk.array('file', 5), asyncHandler(UploadController.uploadImageFromLocalFiles))
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(UploadController.uploadImageFromLocalS3))

module.exports = router;