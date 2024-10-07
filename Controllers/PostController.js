const postModel = require('../Models/postModel')
const mongoose = require('mongoose')
const UserModel = require('../Models/userModel')

const taskController = {};

// Create new Post
taskController.createPost = async (req, res) => {
    const newPost = new postModel(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get a post
taskController.getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await postModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update a post
taskController.updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId, desc, image } = req.body;

    try {
        // const post = await postModel.findById(postId);
        // if (post.userId === userId) {
        //     // await post.updateOne({ $set: req.body });
        //     const updatedPost = await post.updateOne({ $set: { desc, image } }, { new: true });
        //     res.status(200).json(updatedPost);
        // } else {
        //     res.status(403).json("Action forbidden");
        // }
        const updatedPost = await postModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { desc: req.body.desc, image: req.body.image } },
            { new: true }
        );
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" })
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete a post
taskController.deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
    console.log(userId, id);
    try {
        const post = await postModel.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("Post deleted.");
        } else {
            res.status(403).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// like/dislike a post
taskController.likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await postModel.findById(id);
        if (post.likes.includes(userId)) {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Post liked");
        } else {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post Unliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get timeline posts
taskController.getTimelinePosts = async (req, res) => {
    const userId = req.params.id
    try {
        const currentUserPosts = await postModel.find({ userId: userId });

        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts",
                },
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0,
                },
            },
        ]);

        res.status(200).json(
            currentUserPosts
                .concat(...followingPosts[0].followingPosts)
                .sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
        );
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = taskController;