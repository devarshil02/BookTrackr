const { sendResponse, messages } = require("../../helpers/handleResponse");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { verifyHash } = require("../../helpers/hash");
const User = require("../../models/user.modal");
const makeMongoDbServiceUser = require("../../services/db/dbService")({
    model: User,
});

exports.handler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            isSuccess: false,
            status: 'FAILURE',
            message: "Email and password are required.",
        });
    }

    let userData = await makeMongoDbServiceUser.getSingleDocumentByQuery({ email });

    if (!userData) return sendResponse(res, null, 404, messages.invalidRequest('user not found. Please try again.'))

    const passwordIsValid = await verifyHash(password, userData.password);

    if (!passwordIsValid) {
        return sendResponse(
            res,
            null,
            200,
            messages.loginFailed("Incorrect email or password")
        );
    }

    let authToken = jwt.sign({ id: userData._id }, process.env.JWT_SECRET_KEY, { expiresIn: "90d" });
    return sendResponse(res, null, 200, messages.loginSuccess({ token: authToken, user: userData }));
};

exports.rule = Joi.object({
    email: Joi.string().email().required().description("Email address"),
    password: Joi.string().required().description("Password"),
});