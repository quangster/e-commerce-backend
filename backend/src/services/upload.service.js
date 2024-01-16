'use strict'

const cloudinary = require('../configs/cloudinary.config')
const { 
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteBucketCommand,
} = require('../configs/aws.s3.config')
const crypto = require('crypto')
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')
const urlImagePublic = process.env.AWS_CLOUDFRONT_URL_PUBLIC

const randomImageName = () => crypto.randomBytes(16).toString('hex')

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
    },

    //// UPLOAD FILE USE S3CLIENT
    uploadImageFromLocalS3: async({ file }) => {
        try {
            console.log(file)
            
            const imageName = randomImageName()
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName || 'unknown',
                Body: file.buffer,
                ContentType: 'image/jpeg', // that is what your need!
            })
            const result = await s3.send(command)
            // const singedUrl = new GetObjectCommand({
            //     Bucket: process.env.AWS_BUCKET_NAME,
            //     Key: imageName || 'unknown',
            // })
            // const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 })

            // have cloudfront url export
            const signedUrl = getSignedUrl({
                url: `${urlImagePublic}/${imageName}`,
                keyPairId: process.env.AWS_CLOUDFRONT_PUBLIC_KEY_ID,
                dateLessThan: new Date(Date.now() + Number(process.env.AWS_CLOUDFRONT_TIME_EXPIRE)),
                privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
            })
            console.log(result)
            console.log(signedUrl)
            return {
                result,
                signedUrl
            }
        } catch (error) {
            console.error(`Error uploading image:: ${error}`)
        }
    }

    //// END UPLOAD FILE USE S3CLIENT
}

module.exports = UploadService