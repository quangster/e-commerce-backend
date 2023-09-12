'use strict'

const AccessController = {
    register: async(req, res, next) => {
        try {
            return res.status(201).json({
                code: '20001',
                metadata: {userId: 1}
            })
        } catch (error) {
            next(error)
        }
    }
}




module.exports = AccessController