'use strict'

const { 
    BadRequestError,
    NotFoundError,
} = require('../core/error.response')
const discountModel = require('../models/discount.model')
const { findAllProducts } = require('../models/repositories/product.repo')
const { 
    convertToObjectIdMongodb,
} = require('../utils')
const { 
    findAllDiscountCodesSelect, 
    findAllDiscountCodesUnSelect 
} = require('../models/repositories/discount.repo')

/*
    Discount Service
    1 - Generate a discount code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
*/ 

class DiscountService {
    static async createDiscountCode (payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used
        } = payload
        // check
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired')
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }

        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_activate) {
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_shopId: shopId,
            discount_is_activate: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })
        return newDiscount
    }

    static async updateDiscountCode() {

    }

    /*
        Get All Discount codes available with products
    */
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        // create index for discount_code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_activate) {
            throw new NotFoundError('Discount not found or not activate! ')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // get All Products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                }, 
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        } else if (discount_applies_to === 'specific') {
            // get All Products
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true,
                }, 
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }


    /*
        Get All Discount code of Shop
    */
    static async getAllDiscountCodesByShop({limit, page, shopId}) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_activate: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel,
        })
        return discounts
    }
}

module.exports = new DiscountService()