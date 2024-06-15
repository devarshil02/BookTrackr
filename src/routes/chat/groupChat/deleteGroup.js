const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');

exports.handler = async (data, loginUser) => {
    try {
        const { chatId } = data;
        if (!chatId) return sendSocketBadResponse();

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

        const isGroupChat = chatData?.isGroupChat;
        const isGroupAdmin = String(chatData?.groupAdmin?._id) === String(loginUser?._id);

        const isAuthorized = isGroupChat ? isGroupAdmin : !isGroupChat;

        if (!isAuthorized) {
            return {
                isSuccess: isAuthorized,
                status: isAuthorized ? 'SUCCESS' : 'FAILURE',
                message: isAuthorized ? 'Access granted' : 'You are not authorized to access the request'
            };
        }

        const deletedChat = await Chat.findByIdAndDelete(chatId);

        if (deletedChat) {
            return {
                isSuccess: true,
                status: 'SUCCESS',
                message: 'delete successfully.'
            };
        } else {
            return sendSocketBadResponse();
        }

    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    chatId: Joi.string().required(),
});
