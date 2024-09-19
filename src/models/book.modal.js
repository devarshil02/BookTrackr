const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    publicationDate: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    numberOfPages: {
        type: Number,
        required: false,
    },
    publisher: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        default: 'English',
    },
    coverImage: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    availableCopies: {
        type: Number,
        required: true,
        min: 0, 
    }
}, { 
    timestamps: true,
    versionKey: false
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
