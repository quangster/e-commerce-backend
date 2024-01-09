'use strict'

const mongoose = require('mongoose')
const connectString = 'mongodb://localhost:27017/shopDEV'

const testSchema = new mongoose.Schema({ name: String })
const testModel = mongoose.model('test', testSchema)

describe('MongoDB Connection', () => {
    let connection;
    beforeAll(async () => {
        connection = await mongoose.connect(connectString)
    })

    // Close connection to mongodb
    afterAll(async () => {
        await connection.disconnect()
    })

    it('should connect to mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1)
    }) 

    it('should save a document to the database', async () => {
        const user = new testModel({ name: 'quangster test' })
        await user.save();
        expect(user.isNew).toBe(false)
    }) 

    it('should find a document to the database', async () => {
        const user = await testModel.findOne({ name: 'quangster test' })
        expect(user).toBeDefined()
        expect(user.name).toBe('quangster test')
    }) 
})