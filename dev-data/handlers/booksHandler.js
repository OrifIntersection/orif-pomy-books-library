import { Book } from "../models/bookModel.js";

export async function getAllBooks(req, res, next) {
  try {
    const books = await Book.find({}).lean();
    res.status(200).json(books)
  } catch (error) {
    next(error);
  }
}

export function getBook(req, res) {
  console.log(req.params, req.requestTime);
  res.status(404).json("to be implemented");
}

export async function postBook(req, res) {
  const newBook = req.body;
  const result = await booksCollection.insertOne(newBook);

  res.status(201).json({
    status: "success",
    data: result,
  });
}

export function patchBook(req, res) {
  console.log(req.body, req.requestTime);
  res.status(404).json("to be implemented");
}

export function deleteBook(req, res) {
  console.log(req.params, req.requestTime);
  res.status(404).json("to be implemented");
}
