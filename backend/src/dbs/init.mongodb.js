'use strict'

const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect')
const { HOST, PORT, NAME } = require('../configs/mongodb.config')

const connectString = `mongodb://${HOST}:${PORT}/${NAME}`

class Database {

    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb') {
        
        // set debug mongo mode for dev env
        if (process.env.NODE_ENV == 'dev') {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50,
        }).then( (_) => { 
            console.log(`Connected Mongodb Success`)
            // countConnect()
        }).catch((err) => {
            console.log(`Error connect Mongodb`, err.message)
        })
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;