const { default: mongoose } = require("mongoose");
const UserModel = require("../Models/userModel.js");
const { sendResponse, AppError } = require("../helpers/utils.js")
const bcrypt = require('bcrypt');

const taskController = {};
// Registering a new User
taskController.registerUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
        username,
        password: hashedPass,
        firstname,
        lastname,
    });
    try {
        await newUser.save();
        res.status(200).json(newUser);
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


            validity ? res.status(200).json(user) : res.status(400).json("Wrong Password")
        }
        else {
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = taskController;