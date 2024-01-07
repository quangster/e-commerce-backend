"use strict";

const express = require("express");
const CommentController = require("../../controllers/comment.controller");
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler')

const { authentication } = require('../../auth/authUtils')

router.use(authentication)

router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getCommentsByParentId))
router.delete('', asyncHandler(CommentController.deleteComment))


module.exports = router;