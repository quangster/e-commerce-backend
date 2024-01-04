'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

const token = 'MTE5MjQ1MDA0ODQ1MDEwMTMwOA.GUWttT.b0FS-wK7vAi0StbgZEo-FNWgpPtQmDkzW0Dr0E'
client.login(token)

client.on('messageCreate', msg => {
    if (msg.author.bot) return
    if (msg.content === 'hello') {
        msg.reply('world')
    }
})