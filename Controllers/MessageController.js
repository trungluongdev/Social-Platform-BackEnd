const MessageModel = require("../Models/messageModel");
const taskController = {};

taskController.addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel({
        chatId,
        senderId,
        text,
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

taskController.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = taskController;