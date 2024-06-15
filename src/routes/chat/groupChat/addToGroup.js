const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');

exports.handler = async (data) => {
    try {
        const { chatId, users } = data;

        if (!chatId || !users) {
            return sendSocketBadResponse();
        }

        const newUsers = data.users.map(user => String(user));

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return {
                isSuccess: false,
                status: 'FAILURE',
                message: 'Chat not found'
            };
        }

        const alreadyInChat = newUsers.some(user => chat.users.includes(user));

        if (alreadyInChat) {
            return {
                isSuccess: false,
                status: 'FAILURE',
                message: 'One or more users are already in the group'
            };
        }

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: newUsers },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            return sendSocketBadResponse();
        } else {
            return sendSocketResponse(added);
        }
    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    chatId: Joi.string().required(),
    groupName: Joi.any().required(),
});
