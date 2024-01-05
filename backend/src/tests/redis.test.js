const client = require('../dbs/init.redis')
client.ping((err, reply) => {
    if (err) {
        console.log(`Error connect Redis`, err.message)
    }
    console.log(`Connected Redis Success`)
})