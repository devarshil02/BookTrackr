const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');

exports.handler = async (data) => {
    try {
        const { chatId, users } = data;

        if (!chatId || !users) {
            return sendSocketBadResponse();
        }

        const userIds = users.map(user => String(user));

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return {
                isSuccess: false,
                status: 'FAILURE',
                message: 'Chat not found'
            };
        }

        const notInChatUsers = userIds.filter(user => !chat.users.includes(user));

        if (notInChatUsers.length > 0) {
            return {
                isSuccess: false,
                status: 'FAILURE',
                message: 'One or more users not found in the group',
            };
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: { $in: userIds } },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            return sendSocketBadResponse();
        } else {
            return sendSocketResponse(removed);
        }
    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    chatId: Joi.string().required(),
    users: Joi.any().required(),
});
