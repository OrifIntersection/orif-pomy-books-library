import express from "express";
import {
    getAllLoans,
    postLoan,
    patchLoan,
} from "../handlers/loansHandler.js";

const router = express.Router();

router
    .route("/") //  -> '/api/v1/loans/'
    .get(getAllLoans)
    .post(postLoan);

router.route("/:id") //  -> '/api/v1/loans/:id'
    .patch(patchLoan);

export default router;