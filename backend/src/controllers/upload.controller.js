'use strict'

const UploadService = require("../services/upload.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const UploadController = {

    uploadImageFromURL: async(req, res, next) => {
        new SuccessResponse({
            message: "Upload Image success",
            metadata: await UploadService.uploadImageFromURL(req.body)
        }).send(res);
    },        
}

module.exports = UploadController