import { Book } from "../models/bookModel.js";

export async function getAllBooks(req, res, next) {
  try {
    const queryParams = req.query;

    if (queryParams && Object.keys(queryParams).length === 0) {
      const books = await Book.find().lean();
      return res.status(200).json(books);
    }

    const queryObject = {};

    queryObject[queryParams.searchType] = {
      $regex: queryParams.search,
      $options: "i"
    };
    const books = await Book.find(queryObject).lean();
    res.status(200).json(books)
  } catch (error) {
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {
    const queryId = req.params.id;

    const book = await Book.findById(queryId).lean();
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

export async function postBook(req, res, next) {
  try {
    const newBook = req.body;
    const createdBook = await Book.insertOne(newBook, { lean: true });

    console.log("New book created with ID:", createdBook);

    res.status(200).json({
      status: "success",
      data: createdBook,
    });
  } catch (error) {
    next(error);
  }
}

export async function patchBook(req, res, next) {
  try {
    const queryId = req.params.id;
    const updatedData = req.body;

    console.log("Updating book with ID:", queryId, "with data:", updatedData);

    const updatedBook = await Book.findByIdAndUpdate(queryId, updatedData, { new: true, lean: true });
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
    const queryId = req.params.id;

    await Book.findByIdAndDelete(queryId);
    res.status(204).json({
      status: "success",
      message: `Book has been deleted`,
    });
  } catch (error) {
    next(error);
  }
}
