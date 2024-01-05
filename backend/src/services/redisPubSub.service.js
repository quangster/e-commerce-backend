const Redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient();
        this.publisher = Redis.createClient(); 
    }

    publish(channel, message) {
        return new Promise( (resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            })
        })
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message);
            }
        })
    }
}


// const Redis = require('ioredis');

// class RedisPubSubService {
//     constructor() {
//         this.publisher = new Redis();
//         this.subscriber = new Redis();
//     }

//     publish(channel, message) {
//         try {
//             const reply = this.publisher.publish(channel, message);
//                 return reply;
//         } catch (err) {
//             console.error(err);
//         }
//     }
        
//     subscribe(channel, callback) {
//         this.subscriber.subscribe(channel, (err, count) => {
//             if (err) {
//                 console.error(`Failed to subscribe: ${err.message}`)
//             } else {
//                 console.log(
//                     `Subscribed successfully! This client is currently subscribed to ${count} channels.`
//                 )
//             }
//         });
//         this.subscriber.on('message', (channel, message) => {
//             callback(message);
//         });
//     }

// }

module.exports = new RedisPubSubService();