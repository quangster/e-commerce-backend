'use strict'

const configServer = {
    dev: {
        PORT: process.env.DEV_APP_PORT,
    },

    pro: {
        PORT: process.env.PRO_APP_PORT,
    }
}

module.exports = configServer[process.env.NODE_ENV]