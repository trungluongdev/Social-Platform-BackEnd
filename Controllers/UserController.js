const UserModel = require('../Models/userModel')
const bcrypt = require('bcrypt');

const taskController = {};

// get a user
taskController.getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id)
        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json('the user does not exist')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// update user
taskController.updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json('Access denied! You can only update your profile. ')
    }
}

// delete user
taskController.deleteUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully");
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! you can only delete your profile");
    }
}

// Follow a User
taskController.followUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;

    if (currentUserId === id) {
        res.status(403).json("Action forbidden");
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json("User followed successfully!");
            } else {
                res.status(403).json("User is already followed by you");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

// Unfollow a User
taskController.unFollowUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;

    if (currentUserId === id) {
        res.status(403).json("Action forbidden");
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $pull: { followers: currentUserId } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json("User unfollowed successfully!");
            } else {
                res.status(403).json("User is not followed by you");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
module.exports = taskController;