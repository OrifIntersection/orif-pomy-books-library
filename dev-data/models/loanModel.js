import mongoose from "mongoose";

const loansSchema = new mongoose.Schema({
    Book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "A loan must be associated with a book"],
    },
    Collaborator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collaborator",
        required: [true, "A loan must be associated with a collaborator"],
    },
    StartDate: {
        type: Date,
        default: Date.now(),
    },
    EndDate: {
        type: Date,
        default: Date.now() + 14 * 24 * 60 * 60 * 1000, // Default return date is 2 weeks from loan date
    },
    Returned: {
        type: Boolean,
        default: false,
    },
});

export const Loan = mongoose.model("Loan", loansSchema, "Loans");