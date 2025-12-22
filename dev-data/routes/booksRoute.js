import express from "express";
import {
  getAllBooks,
  getBook,
  postBook,
  patchBook,
  deleteBook,
  getDistinctFields
} from "../handlers/booksHandler.js";
import { attachCollaborator, requireCollaborator } from "../handlers/authHandler.js"


const router = express.Router();

router.route("/distinct").get(getDistinctFields)

router
  .route("/") //  -> '/api/v1/books/'
  .get(getAllBooks)
  .post(attachCollaborator, requireCollaborator, postBook);

router
  .route("/:id") //  -> '/api/v1/books/:id'
  .get(attachCollaborator, getBook)
  .patch(attachCollaborator, requireCollaborator, patchBook)
  .delete(attachCollaborator, requireCollaborator, deleteBook);

export default router
