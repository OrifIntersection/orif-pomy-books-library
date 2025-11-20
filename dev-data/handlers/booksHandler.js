import fs from "fs";
import path from "path";


const { client } = path.join(process.cwd(), "index.js");
const booksCollection = client.db("Library_ORIF_Pomy").collection("Books");


export async function getAllBooks(req, res) {
  const books = await booksCollection.find({}).toArray();
  res.status(200).json(books)
}

export function getBook(req, res) {
  console.log(req.params, req.requestTime);
  res.status(404).json("to be implemented");
}

export function postBook(req, res) {
  console.log(req.body);
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
