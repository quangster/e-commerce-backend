'use strict'

const configMongo = {
    dev: {
        HOST: process.env.DEV_MONGO_HOST,
        PORT: process.env.DEV_MONGO_PORT,
        NAME: process.env.DEV_MONGO_NAME,
    },

    pro: {
        HOST: process.env.PRO_MONGO_HOST,
        PORT: process.env.PRO_MONGO_PORT,
        NAME: process.env.PRO_MONGO_NAME,
    }
}

module.exports = configMongo[process.env.NODE_ENV]