'use strict'

const commentModel = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const { NotFoundError } = require('../core/error.response');
const { findProduct } = require('../models/repositories/product.repo');

/*
    key features: Comment service
    + add comment [User, Shop]
    + get a list of comments [User, Shop]
    + delete a comment [User | Shop | Admin]
*/
const CommentService = {

    createComment: async({ productId, userId, content, parentCommentId = null }) => {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue;
        if (parentCommentId) {
            // comment reply
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError('Parent Comment not found');
            }
            rightValue = parentComment.comment_right;
            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 },
            });

            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 },
            });
        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongodb(productId),
            }, 'comment_right', {sort: { comment_right: -1}})
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1;
            }
        }

        // insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    },

    getCommentsByParentId: async({ productId, parentCommentId = null, limit = 50, offset = 0 }) => {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId);
            if (!parent) {
                throw new NotFoundError('Parent Comment not found');
            }

            const comments = await commentModel.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right },
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).sort({
                comment_left: 1,
            })

            return comments
        }

        const comments = await commentModel.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentId: parentCommentId,
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1,
        }).sort({
            comment_left: 1,
        })

        return comments
    },

    deleteComment: async({ commentId, productId }) => {
        // check product exist
        const foundProduct = await findProduct({
            product_id: productId,
            unSelect: []
        });

        if (!foundProduct) {
            throw new NotFoundError('Product not found');
        }

        // 1. xac dinh gia tri left, right cua comment can xoa
        const comment = await commentModel.findById(commentId);
        if (!comment) throw new NotFoundError('Comment not found');

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;

        // 2. tinh width
        const width = rightValue - leftValue + 1;

        // 3. xoa tat ca commentId con
        await commentModel.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue },
        })

        // 4. update lai left, right cua comment cha
        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue },
        }, {
            $inc: { comment_right: -width },
        });

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue },
        }, {
            $inc: { comment_left: -width },
        });

        return true;
    }
}

module.exports = CommentService;