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
      message: `Books retrieved successfully.`,
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

    if (!bookId) {
      return res.status(400).json({
        status: "fail",
        message: "No book ID provided.",
      });
    }

    const book = await Book.findById(bookId, {lean: true})

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID: ${bookId}`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Book with ID: ${bookId} retrieved successfully.`,
      data: book,
    });

  } catch (error) {
    next(error);
  }
}

export async function postBook(req, res, next) {
  try {

    const newBookData = req.body;

    if (!newBookData) {
      return res.status(400).json({
        status: "fail",
        message: "No book data provided.",
      });
    }

    const createdBook = await Book.create(newBookData);

    if (!createdBook) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to create book.",
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
    const updatedBookData = req.body;

    if (!updatedBookData) {
      return res.status(400).json({
        status: "fail",
        message: "No update data provided.",
      });
    }

    if (!bookId) {
      return res.status(400).json({
        status: "fail",
        message: "No book ID provided.",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true, lean: true });

    if (!updatedBook) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID: ${bookId}`,
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

    if (!bookId) {
      return res.status(400).json({
        status: "fail",
        message: "No book ID provided.",
      });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId, { lean: true });

    if (!deletedBook) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID: ${bookId}`,
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
