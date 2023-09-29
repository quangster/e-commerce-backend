"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {

    createProduct = async(req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new Product success',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)

        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }

    unPublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'UnPublish Product success',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }

    // QUERIES 

    /**
     * @description Get all draft products for shop
     * @param {} req 
     * @param {*} res 
     * @param {*} next 
     * @return { JSON }
     */
    getAllDraftsForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get Draft Product list success',
            metadata: await ProductServiceV2.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res)
    }

    getAllPublishForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get Publish Product list success',
            metadata: await ProductServiceV2.findAllPublishForShop({ product_shop: req.user.userId })
        }).send(res)
    }

    getListSearchProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get Search Product list success',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts success',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }
    
    findProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list findProduct success',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController();