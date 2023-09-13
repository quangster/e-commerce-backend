'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require('../auth/authUtils')
const { BadRequestError } = require('../core/error.response')
const { getInfoData } = require('../utils/getInfoData')

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

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey,
        });

        if (!keyStore) throw new BadRequestError('Error: Failed to save key and token')

        // create token pair
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
        // console.log(`Created Token Success ::`, tokens)
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: newShop,
            }),
            tokens
        }
    }
}

module.exports = AccessService 