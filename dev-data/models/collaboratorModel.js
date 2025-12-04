import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "A collaborator must have a name"],
    },
    Email: {
        type: String,
        required: [true, "A collaborator must have an email"],
        unique: true,
    },
    Books: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Book",
        default: [],
    },
    Loans: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Loan",
        default: [],
    },
    JoinedDate: {
        type: Date,
        default: Date.now(),
    },
});

export const Collaborator = mongoose.model("Collaborator", collaboratorSchema, "Collaborators");