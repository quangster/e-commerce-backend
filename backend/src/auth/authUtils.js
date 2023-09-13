'use strict' 

const JWT = require('jsonwebtoken')


// create accessToken and refreshToken 
const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })
        return { accessToken, refreshToken }
    } catch (error) {
        return null
    }
}

// verify token
const verifyToken = async(token, keySecret) => {
    JWT.verify(token, keySecret, (err, decode) => {
        if (err) {
            console.log(`Error Verify ::`, err);
            return false
        } else {
            console.log(`decode verify ::`, decode)
        }
    })
    return true
}

module.exports = {
    createTokenPair,
}