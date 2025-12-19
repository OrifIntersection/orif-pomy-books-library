import express from "express";
import {
    getAllLoans,
    getLoan,
    postLoan,
    deleteLoan,
    patchLoan,
} from "../handlers/loansHandler.js";

import { attachCollaborator, requireCollaborator } from "../handlers/authHandler.js";

const router = express.Router();

router
    .route("/") //  -> '/api/v1/loans/'
    .get(attachCollaborator, getAllLoans)
    .post(attachCollaborator, requireCollaborator, postLoan);

router.route("/:id") //  -> '/api/v1/loans/:id'
    .get(attachCollaborator, requireCollaborator, getLoan)
    .patch(attachCollaborator, requireCollaborator, patchLoan)
    .delete(attachCollaborator, requireCollaborator, deleteLoan);

export default router;