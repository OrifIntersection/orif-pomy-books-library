import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import "./BookTable.css";

function BookTableBody({ books, search, searchType }) {
  const navigate = useNavigate();

  const searchedBooks = books.filter((book) => {
    const selection = book[searchType];

    if (Array.isArray(selection)) {
      return selection.join(", ").toLowerCase().includes(search.toLowerCase());
    }

    if (typeof selection === "string") {
      return selection.toLowerCase().includes(search.toLowerCase());
    }

    return false;
  });

  return searchedBooks.map((book) => (
    <tr
      key={book._id}
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
  ));
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

function BookTableContent({ search, searchType }) {
  const [books, setBooks] = useState([]);

  // fetch books data from API
  useEffect(() => {
    async function getAPI() {
      try {
        const res = await fetch(
          `https://orif-pomy-books-library.vercel.app/api/v1/books`
        );
        if (res.ok) {
          const resBooks = await res.json();
          setBooks(resBooks);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAPI();
  }, []);

  return books ? (
    <table>
      <thead>
        <tr>
          <BookTableHead />
        </tr>
      </thead>
      <tbody>
        <BookTableBody books={books} search={search} searchType={searchType} />
      </tbody>
    </table>
  ) : (
    <p>Loading...</p>
  );
}

function SearchBookTable({ setSearch, setSearchType }) {
  function handleSearchValue(e) {
    setSearch(e.target.value);
  }

  function handleSearchType(e) {
    setSearchType(e.target.value);
  }

  return (
    <>
      <div>
        <label htmlFor="search-books">Recherche de livres : </label>
        <input type="search" id="search-books" onChange={handleSearchValue} />
      </div>
      <div>
        <label htmlFor="search-type">
          Selectionnez le type de recherche :{" "}
        </label>
        <select id="search-type" name="search" onChange={handleSearchType}>
          <option value="Title">Titre</option>
          <option value="Author">Auteur</option>
          <option value="Genre">Genre</option>
          <option value="Subject">Sujet</option>
          <option value="Location">Emplacement</option>
        </select>
      </div>
    </>
  );
}

function BookTable() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("Title");

  return (
    <>
      <SearchBookTable setSearch={setSearch} setSearchType={setSearchType} />
      <BookTableContent search={search} searchType={searchType} />
    </>
  );
}

export default BookTable;
