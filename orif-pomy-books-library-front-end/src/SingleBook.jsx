import { useParams } from "react-router";
import { useState, useEffect } from "react";

function BookHead() {
  return (
    <>
      <th>Titre</th>
      <th>Auteur</th>
      <th>Genre</th>
      <th>Sujet</th>
      <th>Emplacement</th>
      <th>ISBN</th>
    </>
  );
}

function BookBody({ book }) {
  return (
    <tr>
      <td>{book.Title}</td>
      <td>{book.Author.join(", ")}</td>
      <td>{book.Genre.join(", ")}</td>
      <td>{book.Subject.join(", ")}</td>
      <td>{book.Location}</td>
      <td>{book.ISBN}</td>
    </tr>
  );
}

export default function Book() {
  const [book, setBook] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function getAPI() {
      try {
        const res = await fetch(
          `https://orif-pomy-books-library.vercel.app/api/v1/books/${id}`
        );
        if (res.ok) {
          const resBook = await res.json();
          setBook(resBook);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAPI();
  }, [id]);

  return book ? (
    <table>
      <thead>
        <tr>
          <BookHead />
        </tr>
      </thead>
      <tbody>
        <BookBody book={book} />
      </tbody>
    </table>
  ) : (
    <p>loading...</p>
  );
}
