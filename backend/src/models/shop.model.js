'use strict'

// key !mdbgum install by Mongo Snippets foe Nodejs

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shops'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
    },
    password:{
        type:String,
        required:true,
    },
    status: {
        type:String,
        enum: ['activate', 'inactivate'],
        default: 'inactivate',
    },
    verify: {
        type:Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);