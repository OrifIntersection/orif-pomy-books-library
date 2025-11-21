import express from "express";
import {
  getAllBooks,
  getBook,
  postBook,
  patchBook,
  deleteBook,
} from "../handlers/booksHandler.js";


const router = express.Router();

router
  .route("/") //  -> '/api/v1/books/'
  .get(getAllBooks)
  .post(postBook);

router
  .route(":id") //  -> '/api/v1/books:id'
  .get(getBook)
  .patch(patchBook)
  .delete(deleteBook);

export default router
