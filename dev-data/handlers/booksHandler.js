import { Book } from "../models/bookModel.js";

export async function getAllBooks(req, res, next) {
  try {

    //
    //  Search functionality, if no query params, return all books
    // 

    const { search, searchType, sort } = req.query;

    let booksQuery = Book.find().lean();

    if (searchType && search) booksQuery = booksQuery.where(searchType).equals(new RegExp(search, "i"));
    if (sort) booksQuery = booksQuery.sort(sort);

    const books = await booksQuery;

    if (books.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `No books found matching the search criteria.`,
      });
    }
    return res.status(200).json({
      status: "success",
      results: books.length,
      data: books,
    });


  } catch (error) {
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {

    //
    //  Get a single book by ID
    //

    const bookId = req.params.id;

    const bookQuery = Book.findById(bookId).lean();

    const book = await bookQuery;

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID: ${bookId}`,
      });
    }
    return res.status(200).json({
      status: "success",
      data: book,
    });



  } catch (error) {
    next(error);
  }
}

export async function postBook(req, res, next) {
  try {

    const newBook = req.body;
    const createdBook = await Book.create(newBook);

    console.log("New book created with ID:", createdBook);
    if (!createdBook) {
      return res.status(400).json({
        status: "fail",
        message: "Book could not be created.",
      });
    }

    res.status(201).json({
      status: "success",
      data: createdBook,
    });

  } catch (error) {
    next(error);
  }
}

export async function patchBook(req, res, next) {
  try {
    const bookId = req.params.id;
    const updatedData = req.body;

    console.log("Updating book with ID:", bookId, "with data:", updatedData);

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true, lean: true });

    if (!updatedBook) {
      return res.status(404).json({
        status: "fail",
        message: `Book with ID: ${bookId} could not be modified`,
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedBook,
    });

  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId, { lean: true });

    console.log("Deleted book with ID:", bookId, "Details:", deletedBook);

    if (!deletedBook) {
      return res.status(404).json({
        status: "fail",
        message: `Book with ID: ${bookId} could not be deleted`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `Book has been deleted`,
      data: deletedBook,
    });

  } catch (error) {
    next(error);
  }
}
