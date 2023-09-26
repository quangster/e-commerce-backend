'use strict'

const { permission, apiKey } = require('../auth/checkAuth');

const router = require('express').Router()

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome API E-Commerce!'
    })
})

router.use(apiKey);
router.use(permission("0000"));
router.use('/v1/api', require('./access'));
router.use("/v1/api/product", require("./product"));

module.exports = router