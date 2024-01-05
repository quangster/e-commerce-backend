'use strict'

const redis = require('redis');

const redisClient = redis.createClient()

redisClient.connect().then(() => {
    console.log('Connected Redis Success');
}).catch((err) => {
    console.log(err.message);
})

module.exports = redisClient;