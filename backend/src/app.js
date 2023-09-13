const express = require('express')
const app = express()
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

// init middlewares
app.use(morgan('dev')) // other mode: compile, common, short, tiny
app.use(helmet())
app.use(compression()) // compress payload data
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// init database
require('../src/dbs/init.mongodb')

// init routes
app.use('', require('./routes'))

// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code:statusCode,
        message: error.message || "Internal Server Error"
    })
})

module.exports = app