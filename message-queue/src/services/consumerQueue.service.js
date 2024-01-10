'use strict'

const {
    connectToRabbitMQ,
    consumerQueue,
} = require('../dbs/init.rabbit')

const MessageService = {
    consumerQueue: async(queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`Error consumer queue: ${error}`)
        }
    },


    // case processing
    consumerToQueueNormal: async(queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess' // notification queue

            channel.consume(notiQueue, msg => {
                try {
                    const numberTest = Math.random()
                    console.log({ numberTest })
                    if (numberTest < 0.8) {
                        throw new Error('error test')
                    }

                    console.log(`RECEIVED notifications successfully processed:: '${msg.content.toString()}'`)
                    channel.ack(msg)

                } catch (error) {
                    // console.error('RECEIVED notification error::', error)
                    channel.nack(msg, false, false)
                }
            })
        } catch (error) {
            console.error(error)
        }
    },

    // case failure
    consumerToQueueFailed: async(queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            
            const notificationExchangeDLX = 'notificationExDLX'
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

            const notiQueueHandler = 'notificationQueueHotFix'

            await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true })

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)

            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`this notifications error, pls hot fix:: '${msgFailed.content.toString()}'`)
            }, {
                noAck: true
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }


}

module.exports = MessageService