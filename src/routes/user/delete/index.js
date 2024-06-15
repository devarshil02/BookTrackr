const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const User = require("../../../models/user.modal.js");
const makeMongoDbService = require("../../../services/db/dbService.js")({
    model: User,
});
exports.handler = async (req, res) => {
    let userId = req.body.userId;
  const users = await makeMongoDbService.getSingleDocumentByQuery({
    _id: new ObjectId(userId),
  });

  if (!users)
    return sendResponse(
      res,
      null,
      404,
      messages.invalidRequest(
        "Unable to locate a contact associated with this id."
      )
    );
  await makeMongoDbService.deleteDocument({
    _id: new ObjectId(userId),
  });
  return sendResponse(
    res,
    null,
    200,
    messages.successResponse("user deleted successfully.")
  );
};
exports.rule = Joi.object({
    userId: Joi.string().required().length(24).description("user ID"),
});