import fs from "fs";
import path from "path";

const booksPath = path.join(process.cwd(), "dev-data", "data", "books.json");
const booksData = fs.readFileSync(booksPath, "utf-8");
const books = JSON.parse(booksData);

export function getAllBooks(req, res) {
  if (books) {
    console.log("Getting all books...", req.requestTime);
    req.body = books
  }
  res.status(200).json(req.body)
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
