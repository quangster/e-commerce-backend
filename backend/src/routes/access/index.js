'use strict'

const router = require('express').Router()
const AccessController = require('../../controllers/access.controller')

// register
router.post('/shop/register', AccessController.register)


module.exports = router