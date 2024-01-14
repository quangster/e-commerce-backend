'use strict'

const cloudinary = require('../configs/cloudinary.config')



const UploadService = {
    // 1. upload from url image
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

    // 2. upload image from local
    uploadImageFromLocal: async({path, folderName = 'test/image'}) => {
        try {
            const result = await cloudinary.uploader.upload(path, {
                public_id: 'thumb',
                folder: folderName,
            })
            console.log(result);
            return {
                image_url: result.secure_url,
                shopId: 8888,
                thumbSize: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg',
                })
            }
        } catch (error) {
            console.error(`Error uploading image:: ${error}`)
        }
    },

    // 3. upload image from local files
    uploadImageFromLocalFiles: async({ files, folderName = 'test/image' }) => {
        try {
            if (!files.length) return
            const uploadUrls = []
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folderName: folderName,
                })
                uploadUrls.push({
                    image_url: result.secure_url,
                    shopId: 8888,
                    thumbSize: await cloudinary.url(result.public_id, {
                        height: 100,
                        width: 100,
                        format: 'jpg',
                    })
                })
            }
            return uploadUrls
        } catch (error) {
            console.error(`Error uploading image:: ${error}`)
        }
    }
}

module.exports = UploadService