const express = require('express')
const app = express()
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

// init middlewares
app.use(morgan('dev')) // other mode: compile, common, short, tiny
app.use(helmet())
app.use(compression()) // compress payload data

// init database
require('../src/dbs/init.mongodb')

// init routes
app.use('', require('./routes'))

// handling error

module.exports = app