const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const Book = require("../../../models/book.modal");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Book,
});

exports.handler = async (req, res) => {
  const page = parseInt(req.query.pageNumber) || 1;
  const limit = parseInt(req.query.pageSize) || 20;
  const skip = page === 1 ? 0 : parseInt((page - 1) * limit);

  let meta = {};
  const query = {};

  const searchKey = req.query.search;

  if (searchKey) {
    query.$or = [
      { title: { $regex: new RegExp(searchKey, "i") } },
      { author: { $regex: new RegExp(searchKey, "i") } },
      { publisher: { $regex: new RegExp(searchKey, "i") } }
    ];
  }

  let bookList = await makeMongoDbService.getDocumentByCustomAggregation([
    {
      $match: query
    },
    { $sort: { _id: -1 } },
    { $skip: skip },
    { $limit: limit },
  ])
  const total = await Book.countDocuments(query);
  meta = {
    currentPage: page,
    pageSize: limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  return sendResponse(res, null, 200, messages.successResponse(bookList, meta));
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageSize"),
  search: Joi.string()
    .optional()
    .allow("")
    .description("search")
    .example("john")
});
