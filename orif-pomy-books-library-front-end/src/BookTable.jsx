import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router";
import "./BookTable.css";

function BookTableBody({ book }) {

  //
  // useNavigate will set the current URL to include the book ID
  // this will query the API -> getBookById
  //

  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/books/${book._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{book.Title}</td>
      <td>{book.Author.join(", ")}</td>
      <td>{book.Genre.join(", ")}</td>
      <td>{book.Subject.join(", ")}</td>
      <td>{book.Location}</td>
      <td>{book.ISBN}</td>
    </tr>
  );
}

function BookTableHead() {
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

function EditBook({ book }) {
  return <Link className="bookButtons" to={`/books/${book._id}/modify`}>Modifier Livre</Link>;
}

function BorrowBook({ book }) {
  return <Link className="bookButtons" to={`/books/${book._id}/borrow`}>Emprunter Livre</Link>;
}

function BookButtons({ books }) {

  //
  // BookButtons only show when a single book is available
  // we can then use this book ID to update & PATCH the API, or POST the API to borrow the book
  //

  return books.length === 1 ? (
    <>
      <EditBook book={books[0]}/>
      <BorrowBook book={books[0]}/>
    </>
  ) : null
}

function BookTableContent({ books }) {

  //
  // Renders BookTableHead and BookTableBody 
  // (based on the number of books found)
  //

  return (
    <>
      <table className="bookTable">
        <thead>
          <tr>
            <BookTableHead />
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookTableBody key={book._id} book={book} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function SearchBookTable({ submitSearch }) {

  //
  // This search form will only show when multiple books are available
  // if a single book is found, it will no longer show (see BookTable conditional return)
  //

  return (
    <form action={submitSearch} className="searchForm">
      <div>
        <label htmlFor="search-books">Recherche de livres : </label>
        <input type="search" id="search-books" name="search" />
      </div>
      <div>
        <label htmlFor="search-type">
          Selectionnez le type de recherche :{" "}
        </label>
        <select id="search-type" name="search-type">
          <option value="Title">Titre</option>
          <option value="Author">Auteur</option>
          <option value="Genre">Genre</option>
          <option value="Subject">Sujet</option>
          <option value="Location">Emplacement</option>
        </select>
      </div>
      <input type="submit" value="Recherche" />
    </form>
  );
}

function BookTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState();
  const { id } = useParams();

  //
  // function to set search queries to the URL whenever the SearchBookTable form is submitted
  // this will automatically query the API via useEffect
  //

  function submitSearch(formData) {
    const search = formData.get("search");
    const searchType = formData.get("search-type");

    setSearchParams({ search: search, searchType: searchType });
  }

  //
  // query the API based on an ID (if present) and the search queries (if present)
  // defaults to return all books
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const query = searchParams.toString();
        const res = await fetch(
          `https://orif-pomy-books-library.vercel.app/api/v1/books/${id ?? ""}${
            query ? `?${query}` : ""
          }`
        );

        if (res.ok) {
          const resBooks = await res.json();
          if (Array.isArray(resBooks)) setBooks(resBooks);
          else setBooks([resBooks]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAPI();
  }, [id, searchParams]);

  return books ? (
    <>
      {books.length === 1 ? (
        <BookButtons books={books} />
      ) : (
        <SearchBookTable submitSearch={submitSearch} />
      )}
      <BookTableContent books={books} />
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}

export default BookTable;
