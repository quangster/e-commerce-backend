'use strict'

const KeyTokenModel = require("../models/keytoken.model");

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
    }

}

module.exports = KeyTokenService