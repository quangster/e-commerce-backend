'use strict'
const amqp = require('amqplib')

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://admin:password@localhost:5672')
    const channel = await connection.createChannel()

    const queueName = 'ordered-queue-message'
    await channel.assertQueue(queueName, { durable: true })

    // Set prefetch to 1 to ensure only one ack at a time
    channel.prefetch(1)

    channel.consume(queueName, (message) => {
        const msg = message.content.toString()

        setTimeout( () => {
            console.log(`processed: ${msg}`)
            channel.ack(message)
        }, Math.random() * 1000)
    })

    setTimeout( () => {
        connection.close();
    }, 11000)
}

consumerOrderedMessage().catch(console.error)