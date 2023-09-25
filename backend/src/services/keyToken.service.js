'use strict'

const KeyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

const KeyTokenService = {

    // Save key and token to mongodb
    createKeyToken: async({userId, publicKey, privateKey, refreshToken}) => {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken,
            };
            const options = { upsert: true, new: true };
            const tokens = await KeyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return tokens ? tokens.publicKey : null;
        } catch (err) {
            return err;
        }
    },

    removeKeyById: async(userId) => {
        return await KeyTokenModel.findByIdAndDelete(userId).lean()
    },

    findByUserId: async( userId ) => {
        return await KeyTokenModel.findOne({user: new Types.ObjectId(userId)})
    },
}

module.exports = KeyTokenService