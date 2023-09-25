'use strict' 

const JWT = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-rf-token"
};
const KeyTokenService = require("../services/keyToken.service");

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

const authentication = asyncHandler(async (req, res, next) => {
    // 1 - Check userId missing ?
    // 2 - Verify token
    // 3 - Get accessToken
    // 4 - Check user in db
    // 5 - Check keyStore with this userId
    // 6 - OK all => return next()
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Shop not login")

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId != decodeUser.userId) {
                throw new AuthFailureError("Invalid userId");
            }
            req.keyStore = keyStore;
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next();
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid Request");
    
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId != decodeUser.userId) throw new AuthFailureError("Invalid userId");
        req.keyStore = keyStore;
        req.user = decodeUser
        return next();
    } catch (error) {
        throw error;
    }
    
});

module.exports = {
    createTokenPair,
    authentication
}