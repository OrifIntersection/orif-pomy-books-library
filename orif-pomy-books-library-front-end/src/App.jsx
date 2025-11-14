import { useState, useEffect } from 'react'
import './App.css'
import tempBooksData from './temp.json'

function BookTable({ books }) {

  // add <tr key={book._id}>
  return books.map(book =>
    <tr>
      <td>{book.Title}</td>
      <td>{book.Author.join(", ")}</td>
      <td>{book.Genre.join(", ")}</td>
      <td>{book.Subject.join(", ")}</td>
      <td>{book.Location}</td>
      <td>{book.ISBN}</td>
    </tr>
  )
}


function App() {
  const [books, setBooks] = useState([])

  useEffect(() => {

    async function getAPI() {
      try {
        const res = await fetch("https://orif-pomy-books-library.vercel.app/api/v1/books");
        if (res.ok) {

          const resBooks = await res.json()
          console.log(resBooks);
          setBooks(resBooks)
        }
      } catch (error) {
        setBooks(tempBooksData);
        console.log(error)
      }
    }
    getAPI();
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Subject</th>
          <th>Location</th>
          <th>ISBN</th>
        </tr>

      </thead>
      <tbody>
        <BookTable books={books} />
      </tbody>
    </table>
  )
}

export default App
