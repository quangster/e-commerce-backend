'use strict'

const { permission, apiKey } = require('../auth/checkAuth');

const router = require('express').Router()

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome API E-Commerce!'
    })
})

router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'));


module.exports = router