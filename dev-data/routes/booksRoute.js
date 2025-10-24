const express = require("express");
const {
  getAllBooks,
  getBook,
  postBook,
  patchBook,
  deleteBook,
} = require("../handlers/booksHandler.js");

const router = express.Router();

router
  .route("/") //  -> '/api/v1/books/'
  .get(getAllBooks)
  .post(postBook);

router
  .route("/:id") //  -> '/api/v1/books/:id'
  .get(getBook)
  .patch(patchBook)
  .delete(deleteBook);

module.exports = router;
