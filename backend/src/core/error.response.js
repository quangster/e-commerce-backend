'use strict'

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCodes')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}

module.exports = {
    ErrorResponse,
    BadRequestError,
}