const { sendResponse, messages } = require("../../../helpers/handleResponse")
const Joi = require('joi')
const { ObjectId } = require('mongodb');
const User = require("../../../models/user.modal");
const makeMongoDbService = require("../../../services/db/dbService")({
    model: User,
});

exports.handler = async (req, res) => {
    let getUser = await makeMongoDbService.getSingleDocumentByQuery(
        { _id: new ObjectId(req.body.UserId) }
    )

    if (!getUser) return sendResponse(res, null, 404, messages.invalidRequest('Unable to locate a Data associated with this id.'))

    return sendResponse(res, null, 200, messages.successResponse(getUser))
}

exports.rule = Joi.object({
    UserId: Joi.string().required().min(24).max(24).description('UserId')
})