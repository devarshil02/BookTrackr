const Message = require("../../../models/chats/message.modal.js");
const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');

exports.handler = async (chatId) => {
    try {
        if (!chatId) {
            return sendSocketBadResponse();
        }

        const chatData = await Chat.findById(chatId)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!chatData) {
            return {
                isSuccess: false,
                status: 'FAILURE',
                message: 'Record not found with that criteria'
            };
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "firstName lastName profile_avatar email _id")
            .populate("chat");

        return sendSocketResponse(messages)

    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    chatId: Joi.string().required(),
});
