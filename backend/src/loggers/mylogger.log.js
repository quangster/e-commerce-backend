'use strict'

const { format } = require('morgan')
const winston = require('winston')

const { combine, timestamp, json, align, printf } = winston.format

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({level, message, context, requestId, timestamp, metedata}) => {

            }
        )
    }
}

