const { sendResponse, messages } = require("../../helpers/handleResponse");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.modal");
const makeMongoDbServiceUser = require("../../services/db/dbService")({
  model: User,
});

// Function to parse JWT token
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(jsonPayload);
}

exports.handler = async (req, res) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken?.split(" ")[1];
  if (!token) {
    return sendResponse(res, null, 401, messages.loginFailed());
  }

  let decodedToken;
  try {
    decodedToken = parseJwt(token);
  } catch (error) {
    return sendResponse(res, null, 401, messages.loginFailed());
  }

  let query = {};
  if (decodedToken?.email) {
    query = { email: decodedToken.email };
  }

  let userData = await makeMongoDbServiceUser.getSingleDocumentByQuery(query);

  if (userData) {
    let authToken = jwt.sign({ id: userData._id }, process.env.JWT_SECRET_KEY, { expiresIn: "90d" });
    return sendResponse(res, null, 200, messages.loginSuccess({ token: authToken, user: userData }));
  } else {
    let newUser = {
      email: decodedToken.email,
    };
    let newUserData = await makeMongoDbServiceUser.createDocument(newUser);
    let authToken = jwt.sign({ id: newUserData._id }, process.env.JWT_SECRET_KEY, { expiresIn: "90d" });
    return sendResponse(res, null, 200, messages.loginSuccess({ token: authToken, user: newUserData }));
  }
};

exports.rule = Joi.object({
  email: Joi.string().email().allow(null).empty("").description("Email address"),
  password: Joi.string().optional().description("Password"),
});
