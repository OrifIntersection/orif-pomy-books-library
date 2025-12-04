import { Book } from "../models/bookModel.js";
import AppError from "../utils/AppError.js";

export async function getAllBooks(req, res, next) {
  //
  //  Search functionality, if no query params, return all books
  // 

  const { search, searchType, sort } = req.query;

  let booksQuery = Book.find();
  if (searchType && search) booksQuery = booksQuery.where(searchType).equals(new RegExp(search, "i"));
  if (sort) booksQuery = booksQuery.sort(sort);
  const books = await booksQuery;

  if (books.length === 0) throw new AppError("No books found matching the criteria.", 404);

  return res.status(200).json({
    status: "success",
    message: `Books retrieved successfully.`,
    results: books.length,
    data: books,
  });
}

export async function getBook(req, res, next) {
  //
  //  Get a single book by ID
  //

  const bookId = req.params.id;

  if (!bookId) throw new AppError("No book ID provided.", 400);

  const book = await Book.findById(bookId);

  if (!book) throw new AppError(`No book found with ID: ${bookId}`, 404);

  return res.status(200).json({
    status: "success",
    message: `Book with ID: ${bookId} retrieved successfully.`,
    data: book,
  });
}

export async function postBook(req, res, next) {
  const newBookData = req.body;

  if (!newBookData) throw new AppError("No book data provided.", 400);

  const createdBook = await Book.create(newBookData);

  res.status(201).json({
    status: "success",
    data: createdBook,
  });
}

export async function patchBook(req, res, next) {
  const bookId = req.params.id;
  const updatedBookData = req.body;

  if (!updatedBookData) throw new AppError("No book data provided for update.", 400);

  if (!bookId) throw new AppError("No book ID provided.", 400);

  const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });

  if (!updatedBook) throw new AppError(`No book found with ID: ${bookId}`, 404);

  res.status(200).json({
    status: "success",
    data: updatedBook,
  });
}

export async function deleteBook(req, res, next) {
  const bookId = req.params.id;

  if (!bookId) throw new AppError("No book ID provided.", 400);

  const deletedBook = await Book.findByIdAndDelete(bookId);

  if (!deletedBook) throw new AppError(`No book found with ID: ${bookId}`, 404);

  res.status(200).json({
    status: "success",
    message: `Book has been deleted`,
    data: deletedBook,
  });

}
