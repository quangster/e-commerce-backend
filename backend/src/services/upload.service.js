'use strict'

const cloudinary = require('../configs/cloudinary.config')

// 1. upload from url image

const UploadService = {
    uploadImageFromURL: async({url}) => {
        try {
            const folderName = 'test/image', newFileName = 'image1'
            const result = await cloudinary.uploader.upload(url, {
                public_id: newFileName,
                folder: folderName,
            })
            return result
        } catch (error) {
            console.error(error)
        }
    },

}

module.exports = UploadService