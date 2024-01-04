'use strict'

const {
    DISCORD_BOT_TOKEN,
    CHANNEL_ID_DISCORD
} = process.env
const { Client, GatewayIntentBits } = require('discord.js')

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })

        // add channel Id
        this.channelId = CHANNEL_ID_DISCORD

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`)
        })

        this.client.login(DISCORD_BOT_TOKEN);
    }

    sendMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error(`Could not find channel ${this.channelId}`);
            return;
        }
        channel.send(message).catch(err => {
            console.error('Error sending message to discord', err);
        });
    }

    sendFormatCode(logData) {
        const { code, message = 'This is some additional information about the code', title = 'Code Example' } = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ],
        }
        this.sendMessage(codeMessage);
    }
}

// const loggerService = new LoggerService();

module.exports = new LoggerService();