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
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "A user must be logged in to create a book"],
        ref: "Collaborator",
    },
    CreatedOn: {
        type: Date,
        default: Date.now(),
    },
    OwnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collaborator",
    },
    ActiveLoan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        default: null,
    },
});

export const Book = mongoose.model("Book", booksSchema, "Books");