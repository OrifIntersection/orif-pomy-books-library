import fs from 'fs'

const booksData = fs.readFileSync('dev-data/data/books.json', 'utf-8')
const books = JSON.parse(booksData)

export function getAllBooks(req, res) {
  res.json({
    status: 'success',
    received: req.requestTime,
    data: {books}
  })
}

export function getBook(req, res) {
  console.log(req.params, req.requestTime)
  res.status(404).send('to be implemented')
}

export function postBook(req, res) {
  console.log(req.body, req.requestTime)
  res.status(404).send('to be implemented')
}

export function patchBook(req, res) {
  console.log(req.body, req.requestTime)
  res.status(404).send('to be implemented')
}

export function deleteBook(req, res) {
  console.log(req.params, req.requestTime)
  res.status(404).send('to be implemented')
}