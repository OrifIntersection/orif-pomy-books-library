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
    ModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "A user must be logged in to create or modify a book"],
        ref: "Collaborator",
    },
    ModifiedOn: {
        type: Date,
        default: Date.now(),
    },
/*     OwnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collaborator",
    }, */

});


// To be used alongside .populate("ActiveLoan") in queries

booksSchema.virtual("ActiveLoan", {
    ref: "Loan",
    localField: "_id",
    foreignField: "Book",
    justOne: true,
    match: { Returned: false } // Only return the active loan
});

booksSchema.set("toObject", { virtuals: true });
booksSchema.set("toJSON", { virtuals: true });

export const Book = mongoose.model("Book", booksSchema, "Books");