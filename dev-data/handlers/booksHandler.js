import { Book } from "../models/bookModel.js";
import { Collaborator } from "../models/collaboratorModel.js";
import AppError from "../utils/AppError.js";

export async function getAllBooks(req, res, next) {

  //
  //  Search functionality, if no query params, return all books
  //

  const { search, searchType, sortQuery } = req.query;

  let booksQuery = Book.find();
  booksQuery = booksQuery.populate({ path: "ActiveLoan" });

  if (searchType && search)
    booksQuery = booksQuery.where(searchType).equals(new RegExp(search, "i"));

  if (sortQuery) booksQuery = booksQuery.sort(sortQuery);

  const books = await booksQuery;

  if (books.length === 0)
    throw new AppError("No books found matching the criteria.", 404);

  //
  // Additional sorting for ActiveLoan since it is virtual and cannot be sorted in the query
  //

  if (sortQuery === "ActiveLoan")
    books.sort((a, b) => {
      if (a.ActiveLoan && !b.ActiveLoan) return -1;             // if a has loan and b doesn't, a comes first
      else if (!a.ActiveLoan && b.ActiveLoan) return 1;         // if a has no loan and a does, b comes first
      else if (a.ActiveLoan && b.ActiveLoan) {                  // if both have loans, sort by EndDate
        return new Date(a.ActiveLoan.EndDate) - new Date(b.ActiveLoan.EndDate);
      }
      else return 0;
    });

  if (sortQuery === "-ActiveLoan")
    books.sort((a, b) => {
      if (a.ActiveLoan && !b.ActiveLoan) return 1;              // if a has loan and b doesn't, b comes first
      else if (!a.ActiveLoan && b.ActiveLoan) return -1;        // if a has no loan and a does, a comes first
      else if (a.ActiveLoan && b.ActiveLoan) {                  // if both have loans, sort by EndDate
        return new Date(a.ActiveLoan.EndDate) - new Date(b.ActiveLoan.EndDate);
      }
      else return 0;
    });

  // --------------------------------------------------------------------------------------- //

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
  //  This will populate the chosen books ActiveLoan, ModifiedBy fields
  //

  const bookId = req.params.id;
  const userId = req.collaboratorId || null;

  if (!bookId) throw new AppError("No book ID provided.", 400);

  let bookDoc = await Book.findById(bookId)
    .populate({ path: "ActiveLoan" })
    .populate({ path: "ModifiedBy" });

  if (!bookDoc) throw new AppError(`No book found with ID: ${bookId}`, 404);

  // check if the book has been deleted
  if (bookDoc.Deleted) throw new AppError(`You're trying to access a book that has been deleted: ${bookId}`, 404);

  // Convert to object to add HasUserLoan virtual
  let book = bookDoc.toObject({ virtuals: true, getters: true })
  // Mark if the active loan belongs to the logged in user
  if (userId && bookDoc.ActiveLoan?.Collaborator.toString() === userId.toString())
    book.HasUserLoan = true;

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
  // The collaborator creating the book will be added to Book.ModifiedBy
  //

  const { Title, Author, Genre, Subject, Location } = req.body;

  const newBookData = { Title, Author, Genre, Subject, Location };
  const collaboratorId = req.collaboratorId;

  if (!newBookData) throw new AppError("No book data provided", 400);
  if (!collaboratorId) throw new AppError("You are not logged in", 401);

  newBookData.ModifiedBy = collaboratorId;
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
  const collaboratorId = req.collaboratorId;
  const { Title, Author, Genre, Subject, Location } = req.body;

  const updatedBookData = { Title, Author, Genre, Subject, Location };

  if (!updatedBookData)
    throw new AppError("No book data provided for update.", 400);
  if (!bookId) throw new AppError("No book ID provided.", 400);
  if (!collaboratorId) throw new AppError("You are not logged in", 401);

  updatedBookData.ModifiedBy = req.collaboratorId;
  updatedBookData.ModifiedOn = Date.now();

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
  //  Find book by ID, then update Deleted field to true
  //  Collaborator must be logged in
  //

  const bookId = req.params.id;

  if (!bookId) throw new AppError("No book ID provided.", 400);

  const deletedBook = await Book.findByIdAndUpdate(bookId, { Deleted: true });

  if (!deletedBook) throw new AppError(`No book found with ID: ${bookId}`, 404);

  res.status(200).json({
    status: "success",
    message: `Book has been deleted`,
  });
}
