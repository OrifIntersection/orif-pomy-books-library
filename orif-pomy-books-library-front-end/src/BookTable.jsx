import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import "./BookTable.css";

function BookTableBody({ book }) {
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

function EditBook() {
  return <button type="button">Modifier</button>;
}

function BorrowBook() {
  return <button type="button">Emprunter</button>;
}

function BookButtons({ books }) {
  return books.length === 1 ? (
    <div className="bookButtons">
      <EditBook />
      <BorrowBook />
    </div>
  ) : (
    <></>
  );     
}

function BookTableContent({ searchParams }) {
  const [books, setBooks] = useState();
  const { id } = useParams();

  // fetch books data from API, check if an id is specified
  useEffect(() => {
    async function getAPI() {
      try {
        const query = searchParams.toString()
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
      <BookButtons books={books}/>
      <table className="bookTable">
        <thead>
          <tr>
            <BookTableHead />
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookTableBody
              key={book._id}
              book={book}
            />
          ))}
        </tbody>
      </table>
    </>
  ) : (
    <p>Loading...</p>
  );
}

function SearchBookTable({ submitSearch }) {
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

  function submitSearch(formData) {
    const search = formData.get("search");
    const searchType = formData.get("search-type");

    setSearchParams({ search: search, searchType: searchType });
  }

  return (
    <>
      <SearchBookTable submitSearch={submitSearch} />
      <BookTableContent searchParams={searchParams} />
    </>
  );
}

export default BookTable;
