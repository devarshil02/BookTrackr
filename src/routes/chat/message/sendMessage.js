const Message = require("../../../models/chats/message.modal.js");
const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');
const User = require("../../../models/user.modal.js");
const makeMongoDbService = require("../../../services/db/dbService.js")({
    model: Message,
});

exports.handler = async (data, loginUser) => {
    try {
        const { content, chatId, attachments } = data;

        if (!content && (!chatId || !attachments)) {
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

        var newMessage = {
            sender: loginUser?._id,
            content: content,
            chat: chatId,
            attachments:attachments
        };

        let message = await makeMongoDbService.createDocument(newMessage);
        message = await message.populate("sender", "firstName profile_avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastName profile_avatar email",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        return sendSocketResponse(message)

    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    chatId: Joi.string().required(),
    groupName: Joi.any().required(),
});
