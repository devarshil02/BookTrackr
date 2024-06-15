const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');

exports.handler = async (data, loginUser) => {
    try {
        // Check for required fields
        if (!data?.users || !data?.groupName) {
            return sendSocketBadResponse();
        }

        const users = data.users.map(user => String(user));
        console.log(users);

        if (users.length < 2) {
            return {
                isSuccess: false,
                status: 'FAILURE',
                message: 'More than 2 users are required to form a group chat'
            };
        }

        users.push(loginUser._id);

        const groupChat = await Chat.create({
            chatName: data?.groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: loginUser?._id,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return sendSocketResponse(fullGroupChat);
    } catch (error) {
        console.error(error);
        return sendSocketBadResponse(error.message);
    }
};

exports.rule = Joi.object({
    name: Joi.string().required(),
    users: Joi.array().items(Joi.string().hex().length(24)).min(2).required()
});
