const User = require("../../../models/user.modal.js");
const Joi = require("joi");
const {
    sendResponse,
    messages,
} = require("../../../helpers/handleResponse.js");
const { createHash } = require("../../../helpers/hash.js");
const makeMongoDbService = require("../../../services/db/dbService.js")({
    model: User,
});

exports.handler = async (req, res) => {

    const existingUser = await makeMongoDbService.getSingleDocumentByQuery({
        $or: [
            { email: req.body.email },
            { phone: req.body.phone }
        ]
    });

    // If user with the same email or phone exists, return error
    if (existingUser) {
        let conflictField = existingUser.email === req.body.email ? "email" : "phone";
        return sendResponse(
            res,
            null,
            409,
            messages.invalidRequest(`This ${conflictField} is already associated with another user. Please try with another ${conflictField}.`)
        );
    }
    const encryptedPassword = await createHash(req.body.password);
    let user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: encryptedPassword,
    };

    if (req.body.user_type) {
        user.user_type = req.body.user_type;
    }

    if (req.body.profileImage) {
        user.profile_avatar = req.body.profileImage;
    }

    let newUser = await makeMongoDbService.createDocument(user);

    return sendResponse(res, null, 201, messages.successResponse(newUser));

};

exports.rule = Joi.object({
    firstName: Joi.string().optional().description("firstName"),
    lastName: Joi.string().optional().description("lastName"),
    phone: Joi.string().optional().description("phone"),
    email: Joi.string().email().required().description("email"),
    password: Joi.string().optional().description("password"),
    profileImage: Joi.any(),
    user_type: Joi.number().valid(1, 2, 3, 4).optional().description("user_type"),
});