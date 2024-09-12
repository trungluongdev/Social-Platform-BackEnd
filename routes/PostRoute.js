const express = require("express");
const { createPost, getPost, updatePost, deletePost, likePost } = require("../Controllers/PostController");
const router = express.Router();

router.post('/', createPost)
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)


module.exports = router;