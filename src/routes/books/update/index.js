const Book = require("../../../models/book.modal.js");
const Joi = require("joi");
const moment = require('moment');
const {
    sendResponse,
    messages,
} = require("../../../helpers/handleResponse.js");
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
    
    let bookId = req.body.id;

    if (!bookId)
        return sendResponse(
            res,
            null,
            404,
            messages.invalidRequest()
        );

    let getBooks = await makeMongoDbService.getSingleDocumentByQuery({
        _id: bookId,
    });

    if (!getBooks)
        return sendResponse(
            res,
            null,
            400,
            messages.invalidRequest(
                "The requested resource was not found"
            )
        );

    if (req.body.coverImage) {
        req.body.coverImage = req.body.coverImage;
    }

    const newBookData = await makeMongoDbService.findOneAndUpdateDocument(
        { _id: bookId },
        req.body,
        { new: true }
    );
    return sendResponse(res, null, 200, messages.successResponse(newBookData));
};

exports.rule = Joi.object({
    title: Joi.string().required().description("Title of the book"),
    author: Joi.string().required().description("Author of the book"),
    publicationDate: Joi.string().required().custom((value, helpers) => {
        if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
            return helpers.message("Invalid date format, expected DD-MM-YYYY");
        }
        return value;
    }).description("Publication date of the book (DD-MM-YYYY)"),
    genres: Joi.array().items(Joi.string()).optional().description("Genres of the book"),
    description: Joi.string().optional().description("Description of the book"),
    numberOfPages: Joi.number().optional().description("Number of pages in the book"),
    publisher: Joi.string().optional().description("Publisher of the book"),
    language: Joi.string().optional().default('English').description("Language of the book"),
    coverImage: Joi.string().optional().description("URL of the book's cover image"),
    price: Joi.number().required().description("Price of the book"),
    availableCopies: Joi.number().min(0).required().description("Available copies of the book"),
    id: Joi.string().required().min(24).max(24).description('bookId')
});
