import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, "A book must have a title"],
    },
    Author: {
        type: [String],
        required: [true, "A book must have an author"],
    },
    Genre: {
        type: [String],
        required: [true, "A book must have a genre"],
    },
    Subject: {
        type: [String],
        required: [true, "A book must have a subject"],
    },
    Location: {
        type: String,
        required: [true, "A book must have a location"],
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collaborator",
    },
    Loans: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Loan",
        default: [],
    },
});

export const Book = mongoose.model("Book", booksSchema, "Books");