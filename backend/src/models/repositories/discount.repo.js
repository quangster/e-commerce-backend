'use strict'

const { getSelectData, unGetSelectData } = require('../../utils')

const findAllDiscountCodesUnSelect = async({
    limit=50, page=1, sort='ctime',
    filter, model, unSelect
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === ' ctime' ? {_id: -1} : {_id: 1}
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return products
}

const findAllDiscountCodesSelect = async({
    limit=50, page=1, sort='ctime',
    filter, model, select
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === ' ctime' ? {_id: -1} : {_id: 1}
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products
}

const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists,
}