const MessageService = require('./src/services/consumerQueue.service')

const queueName = 'test-topic'

// MessageService.consumerQueue(queueName).then( () => {
//     console.log(`Message consumer start ${queueName}`)
// }).catch( error => {
//     console.error(`Error consumer queue: ${error}`)
// })

MessageService.consumerToQueueNormal(queueName).then( () => {
    console.log(`Message consumerToQueueNormal start ${queueName}`)
}).catch( error => {
    console.error(`Error consumer queue: ${error}`)
})


MessageService.consumerToQueueFailed(queueName).then( () => {
    console.log(`Message consumerToQueueFailed start ${queueName}`)
}).catch( error => {
    console.error(`Error consumer queue: ${error}`)
})