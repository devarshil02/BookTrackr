const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');
const User = require("../../../models/user.modal.js");
const makeMongoDbService = require("../../../services/db/dbService.js")({
    model: Chat,
});

exports.handler = async (data, loginUser) => {
    try {
        const { userId } = data;
        
        if (!loginUser || !userId) {
            return sendSocketBadResponse();
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: loginUser?._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");


        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "firstName lastName profile_avatar email",
        });

        if (isChat.length > 0) {
            // res.send(isChat[0]);
            return sendSocketResponse(isChat[0])
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [loginUser?._id, userId],
            };

            try {
                let createdChat = await makeMongoDbService.createDocument(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );
                // res.status(200).json(FullChat);
                return sendSocketResponse(FullChat);
            } catch (error) {
                return sendSocketBadResponse(error);
            }
        }
    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    message: Joi.string().required(),
    receiverId: Joi.string().required()
});
