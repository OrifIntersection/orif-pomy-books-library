import { Book } from "../models/bookModel.js";
import { Collaborator } from "../models/collaboratorModel.js";
import AppError from "../utils/AppError.js";

export async function getAllBooks(req, res, next) {

  //
  //  Search functionality, if no query params, return all books
  //

  const { search, searchType, sort } = req.query;

  let booksQuery = Book.find();
  if (searchType && search)
    booksQuery = booksQuery.where(searchType).equals(new RegExp(search, "i"));
  if (sort) booksQuery = booksQuery.sort(sort);
  const books = await booksQuery;

  if (books.length === 0)
    throw new AppError("No books found matching the criteria.", 404);

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

  //
  // Create a new book, add to database
  // Collaborator must be logged in
  // The collaborator creating the book will be added to Book.CreatedBy
  //


  const newBookData = req.body;
  const userId = req.userId;

  if (!newBookData) throw new AppError("No book data provided", 400);
  if (!userId) throw new AppError("You are not logged in", 401);

  newBookData.CreatedBy = userId;
  const createdBook = await Book.create(newBookData);

  res.status(201).json({
    status: "success",
    data: createdBook,
  });
}



export async function patchBook(req, res, next) {

  //
  // Find book by ID, then update
  // Only Title, Author, Genre, Subject, Location can be modified
  // To modify the loan, the loan route must be used
  // Logic to modify the owner of the book should also be added
  // Collaborator must be logged in
  //

  const bookId = req.params.id;
  const { Title, Author, Genre, Subject, Location } = req.body;

  const updatedBookData = { Title, Author, Genre, Subject, Location };

  if (!updatedBookData)
    throw new AppError("No book data provided for update.", 400);

  if (!bookId) throw new AppError("No book ID provided.", 400);

  const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, {
    new: true,
  });

  if (!updatedBook) throw new AppError(`No book found with ID: ${bookId}`, 404);

  res.status(200).json({
    status: "success",
    data: updatedBook,
  });
}

export async function deleteBook(req, res, next) {

  //
  //  Find book by ID, then delete
  //  User must be logged in
  //  Deletion could also be handled with a simple Deleted: T/F field
  //  This would preserve the data
  //

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
