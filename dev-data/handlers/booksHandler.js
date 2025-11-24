import { Book } from "../models/bookModel.js";

export async function getAllBooks(req, res, next) {
  try {
    const queryParams = req.query;

    if (req.query && Object.keys(req.query).length === 0) {
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

export async function getBook(req, res) {
  try {
    const book = await Book.findById(req.params.id).lean();
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

export async function postBook(req, res) {
  try {
    const newBook = req.body;
    const result = await booksCollection.insertOne(newBook);

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function patchBook(req, res) {
  console.log(req.body, req.requestTime);
  res.status(404).json("to be implemented");
}

export function deleteBook(req, res) {
  console.log(req.params, req.requestTime);
  res.status(404).json("to be implemented");
}
