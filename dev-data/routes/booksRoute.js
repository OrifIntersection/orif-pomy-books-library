import express from "express";
import {
  getAllBooks,
  getBook,
  postBook,
  patchBook,
  deleteBook,
} from "../handlers/booksHandler.js";
import { protect } from "../handlers/authHandler.js"


const router = express.Router();

router
  .route("/") //  -> '/api/v1/books/'
  .get(getAllBooks)
  .post(protect, postBook);

router
  .route("/:id") //  -> '/api/v1/books/:id'
  .get(getBook)
  .patch(protect, patchBook)
  .delete(protect, deleteBook);

export default router
