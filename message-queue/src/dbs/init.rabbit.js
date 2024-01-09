'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://admin:password@localhost')
        if (!connection) throw new Error('Connection failed')
        const channel = await connection.createChannel()
        return { channel, connection }
    } catch (error) {
        console.log(error)
    }
}

const connectToRabbitMQForTest = async() => {
    try {
        const{ channel, connection } = await connectToRabbitMQ()

        // Publish message to a queue

        const queue = 'test-queue'
        const message = 'Hello, test microservice rabbitmq'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        // close the connection
        await connection.close()
    } catch (error) {
        
    }
}

const consumerQueue = async(channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true })
        console.log(`Waiting for messages in ${queueName}`)
        channel.consume(queueName, msg => {
            console.log(`Received event: '${msg.content.toString()}'`)

            // 1. find User following that SHOP
            // 2. Send message to User
            // 3. Yes, Ok ==> success
            // 4. Error, setup DLX..
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(`error publish message to rabbitmq: ${error}`)
        throw error;
    }
}


module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}