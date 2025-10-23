const fs = require('fs')
const morgan = require('morgan')
const express = require('express')



const app = express()
const port = 3000

// Global middleware
app.use(express.json())
app.use(morgan('dev'))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const booksRouter = require('./dev-data/routes/booksRoute.js')
app.use('/api/v1/books', booksRouter)

app.all("*all", (req, res) => {
  res.status(404).send('404 try at /api/v1/books/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
