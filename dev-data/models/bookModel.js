import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, "A book must have a title"],
    },
    Author: {
        type: String,
        required: [true, "A book must have an author"],
    },
    Genre: {
        type: String,
        required: [true, "A book must have a genre"],
    },
    Subject: {
        type: String,
        required: [true, "A book must have a subject"],
    },
    Location: {
        type: String,
        required: [true, "A book must have a location"],
    },
    ISBN: String,
    Loans: Array,
});

export const Book = mongoose.model("Book", booksSchema, "Books");