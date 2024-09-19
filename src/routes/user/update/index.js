const User = require("../../../models/user.modal.js");
const Joi = require("joi");
const {
    sendResponse,
    messages,
} = require("../../../helpers/handleResponse.js");
const makeMongoDbService = require("../../../services/db/dbService.js")({
    model: User,
});

const { createHash } = require("../../../helpers/hash.js");

exports.handler = async (req, res) => {
    let userId = req.body.id;

    if (!userId)
        return sendResponse(
            res,
            null,
            404,
            messages.invalidRequest()
        );

    let getUser = await makeMongoDbService.getSingleDocumentByQuery({
        _id: userId,
    });

    if (!getUser)
        return sendResponse(
            res,
            null,
            400,
            messages.invalidRequest(
                "The requested resource was not found"
            )
        );

    if (req.body.password) {
        req.body.password = await createHash(req.body.password);
    }

    if (req.body.profileImage) {
        req.body.profile_avatar = req.body.profileImage;
    }

    const newUser = await makeMongoDbService.findOneAndUpdateDocument(
        { _id: userId },
        req.body,
        { new: true }
    );
    return sendResponse(res, null, 200, messages.successResponse(newUser));
};

exports.rule = Joi.object({
    isActive: Joi.string().valid('0', '1').optional(),
    firstName: Joi.string().optional().description("firstName"),
    lastName: Joi.string().optional().description("lastName"),
    phone: Joi.string().optional().description("phone"),
    email: Joi.string().optional().description("email"),
    password: Joi.string().optional().description("password"),
    id: Joi.string().optional().description("id"),
    profileImage: Joi.any(),
    job: Joi.array().items(Joi.string()).optional().description("job"),
});
