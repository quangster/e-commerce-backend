const amqp = require('amqplib')
const messages = 'new product created'

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqp://admin:password@localhost:5672')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' // notification exchange
        const notiQueue = 'notificationQueueProcess' // notification queue
        const notificationExchangeDLX = 'notificationExDLX'
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

        // 1.create Exchange
        await channel.assertExchange(notificationExchange, 'direct', { durable: true })

        // 2.create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3. bind
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4.send message
        console.log(`Send message to queue: ${queueResult.queue} with message: ${messages}`)
        channel.sendToQueue(queueResult.queue, Buffer.from(messages), {
            expiration: 10000
        })

        setTimeout(() => {
            connection.close()
            process.exit(0);
        }, 500)


    } catch (error) {
        console.error(`error: ${error}`)
    }
}

runProducer().catch(console.error)