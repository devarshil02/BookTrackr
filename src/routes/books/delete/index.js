const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const Book = require("../../../models/book.modal.js");
const makeMongoDbService = require("../../../services/db/dbService.js")({
  model: Book,
});
exports.handler = async (req, res) => {

  if (req?.user?.user_type === 2) {
    return sendResponse(
      res,
      null,
      403,
      messages.invalidRequest("You are not authorized to perform this action.")
    );
  }

  let bookId = req.body.bookId;

  const getBook = await makeMongoDbService.getSingleDocumentByQuery({
    _id: new ObjectId(bookId),
  });

  if (!getBook)
    return sendResponse(
      res,
      null,
      404,
      messages.invalidRequest(
        "Unable to locate a contact associated with this id."
      )
    );

  await makeMongoDbService.deleteDocument({
    _id: new ObjectId(bookId),
  });

  return sendResponse(
    res,
    null,
    200,
    messages.successResponse("Book deleted successfully.")
  );
};
exports.rule = Joi.object({
  bookId: Joi.string().required().length(24).description("Book ID"),
});