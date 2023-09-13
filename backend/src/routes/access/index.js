'use strict'

const router = require('express').Router()
const AccessController = require('../../controllers/access.controller')
const asyncHandler = require('../../utils/asyncHandler')

router.post('/shop/register', asyncHandler(AccessController.register))

module.exports = router