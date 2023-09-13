'use strict'

const router = require('express').Router()

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome API E-Commerce!'
    })
})

router.use('/v1/api', require('./access'))

module.exports = router