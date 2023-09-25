'use strict'

const router = require('express').Router()
const AccessController = require('../../controllers/access.controller')
const asyncHandler = require('../../utils/asyncHandler')
const { authentication } = require('../../auth/authUtils')

router.post('/shop/register', asyncHandler(AccessController.register))
router.post('/shop/login', asyncHandler(AccessController.login))
router.use(authentication)
router.post('/shop/logout', asyncHandler(AccessController.logout))

module.exports = router