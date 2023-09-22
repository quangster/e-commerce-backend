'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require('../auth/authUtils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { getInfoData } = require('../utils/getInfoData')
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

const AccessService = {

    register: async({name, email, password}) => {
        // check email exist
        const holderShop = await shopModel.findOne({email}).lean()
        
        if (holderShop) throw new BadRequestError('Error: Shop already register !!!');

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);


        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (!newShop) throw new BadRequestError('Error: Failed to save Shop')

        // create privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        // console.log({ privateKey, publicKey }) // save collection keystore

        // create token pair
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
        // console.log(`Created Token Success ::`, tokens)

    
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore) throw new BadRequestError('Error: Failed to save key and token')

        
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: newShop,
            }),
            tokens
        }
    },

    login: async({email, password}) => {
        // check email exist
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Error: Shop not register !!!');

        // match password
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication Failure !!!');

        // create privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // create tokens
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)

        const keyStore = await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore) throw new BadRequestError('Error: Failed to save key and token')

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens  
        }
    }
}

module.exports = AccessService 