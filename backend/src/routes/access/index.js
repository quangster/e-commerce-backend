'use strict'

const router = require('express').Router()
const AccessController = require('../../controllers/access.controller')
const asyncHandler = require('../../utils/asyncHandler')

router.post('/shop/register', asyncHandler(AccessController.register))
router.post('/shop/login', asyncHandler(AccessController.login))

module.exports = router