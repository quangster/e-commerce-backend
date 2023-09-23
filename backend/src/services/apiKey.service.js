'use strict'

const { apiKey } = require('../auth/checkAuth')
const apiKeyModel = require('../models/apikey.model')
const crypto = require('crypto')

const findById = async(key) => {
    // insert a new API KEY test
    // const newKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000'],
    // })
    // console.log(newKey)
    return await apiKeyModel.findOne({ key, status: true }).lean();
}

module.exports = {
    findById,
}