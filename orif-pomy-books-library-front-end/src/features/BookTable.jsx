import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router";
import APIHandler from "../utils/APIHandler.jsx";
import GetForm from "./BookRoutes/GetForm.jsx";

const booksAPIHandler = new APIHandler("books");

function BookTableBody({ book }) {
  //
  // useNavigate will set the current URL to include the book ID
  // this will query the API -> getBookById
  //

  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/livres/${book._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{book.Title}</td>
      <td>{book.Author.join(", ")}</td>
      <td>{book.Genre.join(", ")}</td>
      <td>{book.Subject.join(", ")}</td>
      <td>{book.Location}</td>
      {book.ActiveLoan ? <td style={{ color: "red" }}>Emprunté</td> : <td>Disponible</td>}
    </tr>
  );
}

function BookTableHead({ searchParams, setSearchParams, books }) {
  function sortBooks(e) {
    //
    // function to set sort queries to the URL whenever a sort button is clicked
    // this will automatically query the API via useEffect
    //

    const sortBy = e.target.name;
    let currentParams = Object.fromEntries([...searchParams]);

    if (currentParams.sort === sortBy) {
      currentParams.sort = `-${sortBy}`;
      setSearchParams(currentParams);
      return;
    }

    currentParams.sort = sortBy;
    setSearchParams(currentParams);
  }

  function sortIcon(column) {
    //
    //  Render icon dynamically based on current sort state
    //  If only one book is available, no sort icon is shown
    //

    if (books.length === 1) return;

    if (searchParams.get("sort") === column) {
      return "↑";
    } else if (searchParams.get("sort") === `-${column}`) {
      return "↓";
    }

    return "⇅";
  }

  return (
    <>
      <th>
        Titre
        <button className="sortButton" name="Title" onClick={sortBooks}>
          {sortIcon("Title")}
        </button>
      </th>
      <th>
        Auteur
        <button className="sortButton" name="Author" onClick={sortBooks}>
          {sortIcon("Author")}
        </button>
      </th>
      <th>
        Genre
        <button className="sortButton" name="Genre" onClick={sortBooks}>
          {sortIcon("Genre")}
        </button>
      </th>
      <th>
        Sujet
        <button className="sortButton" name="Subject" onClick={sortBooks}>
          {sortIcon("Subject")}
        </button>
      </th>
      <th>
        Emplacement
        <button className="sortButton" name="Location" onClick={sortBooks}>
          {sortIcon("Location")}
        </button>
      </th>
      <th>
        Disponilibité
        <button className="sortButton" name="ActiveLoan" onClick={sortBooks}>
          {sortIcon("ActiveLoan")}
        </button>
      </th>
    </>
  );
}

function SingleBook({ book }) {
  //
  // SingleBook only show when a single book is available
  // we can then use this book ID to update & PATCH the API, or POST the API to borrow the book
  //

  return (
    <div className="singleBookDetails">
      <Link className="bookButtons" to={`/livres/${book._id}/modifier`}>
        Modifier Livre
      </Link>
      <Link className="bookButtons" to={`/livres/${book._id}/emprunter`}>
        Emprunter Livre
      </Link>
      <Link className="bookButtons" to={`/livres/${book._id}/supprimer`}>
        Supprimer Livre
      </Link>
      <p>
        Ce livre a été dernièrement modifié par:{" "}
        {book.ModifiedBy?.Name || "inconnu"} le{" "}
        {new Date(book.ModifiedOn).toLocaleDateString("fr-FR")}
      </p>
      {book.ActiveLoan ? (
        <p>
          Ce livre est emprunté jusqu'au{" "}
          {new Date(book.ActiveLoan.EndDate).toLocaleDateString("fr-FR")}
        </p>
      ) : (
        <p>Ce livre peut être emprunté</p>
      )}
    </div>
  );
}

function BookTableContent({ books, searchParams, setSearchParams }) {
  //
  // Renders BookTableHead and BookTableBody
  // (based on the number of books found)
  //

  return (
    <>
      <table className="bookTable">
        <thead>
          <tr>
            <BookTableHead
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              books={books}
            />
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

function BookTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState();
  const { id } = useParams();

  //
  // query the API based on an ID (if present) and the search queries (if present)
  // defaults to return all books
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get(searchParams, id);
        if (Array.isArray(body.data)) setBooks(body.data);
        else setBooks([body.data]);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, [id, setSearchParams]);

  //
  // need to fix for if an ID has correct syntax but doesn't exist
  // returns an emtpy object on setBooks => [{}]
  //

  return books ? (
    <>
      {books.length === 1 ? (
        <SingleBook book={books[0]} />
      ) : (
        <GetForm setSearchParams={setSearchParams} />
      )}
      <BookTableContent
        books={books}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}

export default BookTable;
