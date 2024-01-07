'use strict'

const CommentService = require("../services/comment.service");
const { CREATED, SuccessResponse } = require('../core/success.response')

const CommentController = {

    createComment: async(req, res, next) => {
        new SuccessResponse({
            message: "create new comment",
            metadata: await CommentService.createComment(req.body),
        }).send(res);
    },


    getCommentsByParentId: async(req, res, next) => {
        new SuccessResponse({
            message: "get list comment by parent id",
            metadata: await CommentService.getCommentsByParentId(req.query),
        }).send(res);
    },

    deleteComment: async(req, res, next) => {
        new SuccessResponse({
            message: "delete comment",
            metadata: await CommentService.deleteComment(req.body),
        }).send(res);
    },
}

module.exports = CommentController