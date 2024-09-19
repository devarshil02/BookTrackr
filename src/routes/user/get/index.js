const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const User = require("../../../models/user.modal");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: User,
});

exports.handler = async (req, res) => {
  const page = parseInt(req.query.pageNumber) || 1;
  const limit = parseInt(req.query.pageSize) || 20;
  const skip = page === 1 ? 0 : parseInt((page - 1) * limit);
  const startIndex = (page - 1) * limit;
  let meta = {};
  const query = {};
  const { user } = req;

  if (user?.user_type === 2) {
    query._id = user._id;
  }

  const searchKey = req.query.search;

  if (searchKey) {
    query.$or = [
      { email: { $regex: new RegExp(searchKey, "i") } },
      { firstName: { $regex: new RegExp(searchKey, "i") } },
      { lastName: { $regex: new RegExp(searchKey, "i") } },
      { phone: { $regex: new RegExp(searchKey, "i") } },
    ];
  }

  let userList = await makeMongoDbService.getDocumentByCustomAggregation([
    {
      $match: query
    },
    { $sort: { _id: -1 } },
    { $skip: skip },
    { $limit: limit },
  ])
  const total = await User.countDocuments(query);
  meta = {
    currentPage: page,
    pageSize: limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  return sendResponse(res, null, 200, messages.successResponse(userList, meta));
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
