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
    
    const existingBook = await makeMongoDbService.getSingleDocumentByQuery({
        title: req.body.title,
    });

    if (existingBook) {
        return sendResponse(
            res,
            null,
            409,
            messages.invalidRequest(`The book titled '${req.body.title}' already exists.`)
        );
    }

    let bookData = {
        title: req.body.title,
        author: req.body.author,
        publicationDate: req.body.publicationDate,
        genres: req.body.genres,
        description: req.body.description,
        numberOfPages: req.body.numberOfPages,
        publisher: req.body.publisher,
        language: req.body.language,
        price: req.body.price,
        availableCopies: req.body.availableCopies,
    };

    if (req.body.coverImage) {
        bookData.coverImage = req.body.coverImage;
    }

    let newBook = await makeMongoDbService.createDocument(bookData);

    return sendResponse(res, null, 201, messages.successResponse(newBook));

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
});