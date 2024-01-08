const amqp = require('amqplib')
const messages = 'hello worlds, rabbitmq'

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqp://admin:password@localhost:5672')
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, { durable: true })

        // send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log(`Message sent:: ${messages}`)

    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(console.error)