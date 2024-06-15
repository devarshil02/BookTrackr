const Chat = require("../../../models/chats/chat.modal.js");
const Joi = require("joi");
const { sendSocketBadResponse, sendSocketResponse } = require('../../../helpers/handleResponse.js');
const User = require("../../../models/user.modal.js");
// const makeMongoDbService = require("../../../services/db/dbService.js")({
//     model: Chat,
// });

exports.handler = async (loginUser) => {
    try {

        // const { userId } = data;

        if (!loginUser) {
            return sendSocketBadResponse();
        }

        const chatData = await Chat.find({
            users: { $elemMatch: { $eq: loginUser._id } },
            $or: [
                { isGroupChat: true },
                { isGroupChat: false, latestMessage: { $ne: null } }
            ]
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const results = await User.populate(chatData, {
            path: "latestMessage.sender",
            select: "firstName lastName profile_avatar email",
        });

        return sendSocketResponse(results);
    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    userId: Joi.string().required()
});
