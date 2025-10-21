const fs = require('fs')

const express = require('express')
const app = express()
const port = 3000

const booksData = fs.readFileSync(`${__dirname}/dev-data/data/books.json`, 'utf-8')
const books = JSON.parse(booksData)

app.get('/api', (req, res) => {
  res.json(books)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
