"use strict";

const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler')

const { authentication } = require('../../auth/authUtils')

router.use(authentication)

router.get('', asyncHandler(NotificationController.getListNotiByUser))
module.exports = router;