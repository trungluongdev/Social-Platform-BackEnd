const express = require('express');
const commentController = require('../Controllers/CommentController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/', authMiddleware, commentController.createNewComment);

router.get('/:id', commentController.getSingleComment);

router.get('/comment/:postid', commentController.getCommentByPostId);

router.put('/:id', authMiddleware, commentController.updateSingleComment);

router.delete('/:id', authMiddleware, commentController.deleteSingleComment);

module.exports = router;
