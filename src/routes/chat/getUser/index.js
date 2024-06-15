const Joi = require("joi");
const User = require("../../../models/user.modal");
const { sendSocketBadResponse, sendSocketResponse } = require("../../../helpers/handleResponse");

exports.handler = async (loginUser, data) => {

    try {
        let meta = {};

        const userData = await User.find({ _id: { $ne: loginUser?.id } }).sort({ _id: -1 });

        meta = {
            total:userData?.length,
        };
        return sendSocketResponse(userData, meta);

    } catch (error) {
        return sendSocketBadResponse(error);
    }
};

exports.rule = Joi.object({
    search: Joi.string()
        .optional()
        .allow("")
        .description("search")
        .example("john")
});
