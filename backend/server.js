const app = require("./src/app");

const { PORT } = require('./src/configs/server.config')

const server = app.listen(PORT, () => {
    console.log(`Server eCommerce start with ${PORT}`)
})

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit server eCommerce`))
// })