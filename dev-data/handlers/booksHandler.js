import { Book } from "../models/bookModel.js";
import AppError from "../utils/AppError.js";

export async function getAllBooks(req, res, next) {

  //
  //  Search functionality, if no query params, return all books
  //

  const { search, searchType, sortQuery } = req.query;

  // only return books that are not deleted
  let booksQuery = Book.find().where("Deleted").equals(false);
  booksQuery = booksQuery.populate({ path: "ActiveLoan" });

  if (searchType && search)
    booksQuery = booksQuery.where(searchType).equals(new RegExp(search, "i"));

  if (!searchType && search) {
    booksQuery = booksQuery.or([
      { Title: new RegExp(search, "i") },
      { Author: new RegExp(search, "i") },
      { Genre: new RegExp(search, "i") },
      { Subject: new RegExp(search, "i") },
      { Location: new RegExp(search, "i") }
    ]);
  }

  if (sortQuery) booksQuery = booksQuery.sort(sortQuery);

  const books = await booksQuery;

  if (books.length === 0) throw new AppError("UNFOUND_BOOK_SEARCH");

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

  if (!bookId) throw new AppError("NO_BOOK_ID");

  let bookDoc = await Book.findById(bookId)
    .populate({ path: "ActiveLoan" })
    .populate({ path: "ModifiedBy" });

  if (!bookDoc) throw new AppError("UNFOUND_BOOK_ID");

  // check if the book has been deleted
  if (bookDoc.Deleted) throw new AppError("DELETED");

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

  if (!Title) throw new AppError("NO_TITLE");
  if (!Author) throw new AppError("NO_AUTHOR");
  if (!Genre) throw new AppError("NO_GENRE");
  if (!Subject) throw new AppError("NO_SUBJECT");
  if (!Location) throw new AppError("NO_LOCATION");

  const newBookData = { Title, Author, Genre, Subject, Location };
  const collaboratorId = req.collaboratorId;

  if (!collaboratorId) throw new AppError("UNAUTHORIZED");

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

  const { Title, Author, Genre, Subject, Location } = req.body;

  if (!Title) throw new AppError("NO_TITLE");
  if (!Author) throw new AppError("NO_AUTHOR");
  if (!Genre) throw new AppError("NO_GENRE");
  if (!Subject) throw new AppError("NO_SUBJECT");
  if (!Location) throw new AppError("NO_LOCATION");

  const bookId = req.params.id;

  if (!bookId) throw new AppError("NO_BOOK_ID");

  const collaboratorId = req.collaboratorId;

  if (!collaboratorId) throw new AppError("UNAUTHORIZED");

  const updatedBookData = { Title, Author, Genre, Subject, Location };
  updatedBookData.ModifiedBy = req.collaboratorId;
  updatedBookData.ModifiedOn = Date.now();

  const updatedBook = await Book.findById(bookId).where("Deleted").equals(false);

  if (!updatedBook) throw new AppError("UNFOUND_BOOK_ID")

  Object.assign(updatedBook, updatedBookData);
  await updatedBook.save();

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

  if (!bookId) throw new AppError("NO_BOOK_ID");

  const bookDoc = await Book.findById(bookId).populate("ActiveLoan");

  if (!bookDoc) throw new AppError("UNFOUND_BOOK_ID");
  if (bookDoc.ActiveLoan) throw new AppError("CANNOT_DELETE_WHILE_LOANED");
  if (bookDoc.Deleted === true) throw new AppError("CANNOT_DELETE_DELETED_BOOK")

  bookDoc.Deleted = true;
  await bookDoc.save();

  res.status(200).json({
    status: "success",
    message: `Book has been deleted`,
  });
}


export async function getDistinctFields(req, res, next) {

  // will return each distinct/unique field on /api/v1/books/distinct

  const uniqueGenres = await Book.distinct("Genre", { Deleted: false })
  const uniqueSubjects = await Book.distinct("Subject", { Deleted: false });
  const uniqueLocations = await Book.distinct("Location", { Deleted: false });

  const resData = { Genres: uniqueGenres, Subjects: uniqueSubjects, Locations: uniqueLocations };

  res.status(200).json({
    status: "success",
    message: "unique identifiers returned",
    data: resData,
  });
}