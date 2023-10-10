'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick( object, fields )
}


// ['a', 'b', 'c'] => {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 1]))
}

// ['a', 'b', 'c'] => {a: 0, b: 0, c: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 0]))
}

const removeUndefinedObject = (obj) => {
    // console.log(`removeUndefinedObject::[1]::`, obj)
    Object.keys(obj).forEach( key => {
        if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) removeUndefinedObject(obj[key]);
        if (obj[key] == null || obj[key] == undefined) {
            delete obj[key]
        }
    })
    // console.log(`removeUndefinedObject::[2]::`, obj)
    return obj
}


const updateNestedObjectParser = (obj) => {
    // console.log(`updateNestedObjectParser::[1]::`, obj)
    const final = {}
    Object.keys(obj || {}).forEach( key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            // console.log(obj[key])
            const response = updateNestedObjectParser(obj[key])
            Object.keys(response).forEach(a => {
                final[`${key}.${a}`] = response[a]
            })
        } else {
            final[key] = obj[key]
        }
    })
    // console.log(`updateNestedObjectParser::[2]::`, final)
    return final
}

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id)

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
}