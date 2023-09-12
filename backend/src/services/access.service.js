'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

const AccessService = {
    register: async({name, email, password}) => {
        try {
            // check email exist
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already register!',

                }
            }
            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name, email, password, roles: [RoleShop.SHOP]
            })
            if (!newShop) {

            }
            // create privateKey, publicKey
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096
            })
            console.log({ privateKey, publicKey }) // save collection keystore

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService