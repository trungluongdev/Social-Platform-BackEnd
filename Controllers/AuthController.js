const { default: mongoose } = require("mongoose");
const UserModel = require("../Models/userModel.js");
const { sendResponse, AppError } = require("../helpers/utils.js")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const taskController = {};
// Registering a new User
taskController.registerUser = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass
    const newUser = new UserModel(req.body);
    const { username } = req.body
    try {
        oldUser = await UserModel.findOne({ username })
        if (oldUser) {
            return res.status(400).json({ message: 'Username is already registered' })
        }
        const user = await newUser.save();
        const token = jwt.sign({
            username: user.username, id: user._id
        }, process.env.JWT_KEY,
            { expiresIn: '72h' }
        )
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

taskController.loginUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await UserModel.findOne({ username: username })


        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            if (!validity) {
                res.status(400).json("Wrong Password")
            } else {
                const token = jwt.sign({
                    username: user.username, id: user._id
                }, process.env.JWT_KEY,
                    { expiresIn: '72h' }
                )
                res.status(200).json({ user, token })
            }
        }
        else {
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = taskController;