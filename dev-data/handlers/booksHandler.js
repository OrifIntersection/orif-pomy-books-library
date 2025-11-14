import fs from "fs";

const booksData = fs.readFileSync("./dev-data/data/books.json", "utf-8");
const books = JSON.parse(booksData);

export function getAllBooks(req, res) {
  res.status(200).json(books);
}

export function getBook(req, res) {
  console.log(req.params, req.requestTime);
  res.status(404).json("to be implemented");
}

export function postBook(req, res) {
  console.log(req.body, req.requestTime);
  res.status(201).json({
    status: "success",
    data: req.body,
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
