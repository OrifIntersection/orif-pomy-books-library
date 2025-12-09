import express from "express";
import {
    getAllLoans,
    postLoan,
    deleteLoan,
} from "../handlers/loansHandler.js";

import { protect } from "../handlers/authHandler.js";

const router = express.Router();

router
    .route("/") //  -> '/api/v1/loans/'
    .get(getAllLoans)
    .post(protect, postLoan);

router.route("/:id") //  -> '/api/v1/loans/:id'
    .delete(protect, deleteLoan);

export default router;