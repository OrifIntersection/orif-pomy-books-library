import express from "express";
import {
    getAllLoans,
    postLoan,
    deleteLoan,
} from "../handlers/loansHandler.js";

import { attachCollaborator, requireCollaborator } from "../handlers/authHandler.js";

const router = express.Router();

router
    .route("/") //  -> '/api/v1/loans/'
    .get(getAllLoans)
    .post(attachCollaborator, requireCollaborator, postLoan);

router.route("/:id") //  -> '/api/v1/loans/:id'
    .delete(attachCollaborator, requireCollaborator, deleteLoan);

export default router;