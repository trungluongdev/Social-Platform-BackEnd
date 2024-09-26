const express = require("express");
const { createPost, getPost, updatePost, deletePost, likePost, getTimelinePosts } = require("../Controllers/PostController");
const router = express.Router();

router.post('/', createPost)
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.delete('/:userId/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/:id/timeline', getTimelinePosts)
router.get('/:id/comments', getTimelinePosts)


module.exports = router;