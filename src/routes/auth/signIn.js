const { sendResponse, messages } = require("../../helpers/handleResponse");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.modal");
const { verifyHash } = require("../../helpers/hash");
const makeMongoDbServiceUser = require("../../services/db/dbService")({
  model: User,
});

exports.handler = async (req, res) => {
  let user;

  if (req.body.email) {
    user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
      email: req.body.email,
    });
  } else if (req.body.phone) {
    user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
      phone: req.body.phone,
    });
  }

  if (!user) {
    if (req.body.email) {
      return sendResponse(
        res,
        null,
        200,
        messages.loginFailed("Incorrect email or password")
      );
    } else if (req.body.phone) {
      return sendResponse(
        res,
        null,
        200,
        messages.loginFailed("Incorrect phone or password")
      );
    }
  }

  if (user.user_type === 1 || user.user_type === 4) {
    return res
      .set({ "Content-Type": "application/json" })
      .status(401)
      .send({
        isSuccess: false,
        status: "UNAUTHORIZED",
        message: "You are not authorized to access the request",
        data: {},
      });
  }

  const passwordIsValid = await verifyHash(req.body.password, user.password);

  if (!passwordIsValid) {
    if (req.body.email) {
      return sendResponse(
        res,
        null,
        200,
        messages.loginFailed("Incorrect email or password")
      );
    } else if (req.body.phone) {
      return sendResponse(
        res,
        null,
        200,
        messages.loginFailed("Incorrect phone or password")
      );
    }
  }

  let token = jwt.sign(
    {
      id: user.id,
    },
    process.env.API_SECRET,
    {
      expiresIn: "90d",
    }
  );

  let userData = await makeMongoDbServiceUser.getSingleDocumentByQuery({
    $or: [
      { email: req.body.email },
      { phone: req.body.phone },
    ]
  }, '-password');


  return sendResponse(res, null, 200, messages.loginSuccess({ token, userData }));
};

exports.rule = Joi.object({
  email: Joi.string()
    .email()
    .allow(null)
    .empty("")
    .description("Email address"),
  phone: Joi.string().allow(null).empty("").description("Phone number"),
  password: Joi.string().required().description("Password"),
});