'use strict'

const UploadService = require("../services/upload.service");
const { CREATED, SuccessResponse } = require('../core/success.response')
const { BadRequestError } = require('../core/error.response')

const UploadController = {

    uploadImageFromURL: async(req, res, next) => {
        new SuccessResponse({
            message: "Upload Image success",
            metadata: await UploadService.uploadImageFromURL(req.body)
        }).send(res);
    }, 
    
    uploadImageFromLocal: async(req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError('File is required')
        new SuccessResponse({
            message: "Upload Image success",
            metadata: await UploadService.uploadImageFromLocal({
                path:file.path,
            })
        }).send(res);
    },  

    uploadImageFromLocalFiles: async(req, res, next) => {
        const { files } = req
        if (!files.length) throw new BadRequestError('File is required')
        new SuccessResponse({
            message: "Upload Multi Images success",
            metadata: await UploadService.uploadImageFromLocalFiles({
                files,
            })
        }).send(res);
    },  
}

module.exports = UploadController