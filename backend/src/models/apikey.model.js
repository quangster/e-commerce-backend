'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'APIKey'
const COLLECTION_NAME = 'APIKeys'

const apiKeySchema = new Schema({
    key: {
        type: String, required: true, unique: true,
    },
    status: {
        type: Boolean, default: true,
    },
    permissions: {
        type: [String], required: true, enum: ['0000', '1111', '2222'],
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);