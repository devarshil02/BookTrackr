const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');

exports.handler = async (data, loginUser) => {
    try {
        const { chatId, groupName } = data;

        if (!chatId || !groupName) {
            return sendSocketBadResponse();
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: groupName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return sendSocketBadResponse();
        } else {
            return sendSocketResponse(updatedChat);
        }
    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    chatId: Joi.string().required(),
    groupName: Joi.string().required(),
});
