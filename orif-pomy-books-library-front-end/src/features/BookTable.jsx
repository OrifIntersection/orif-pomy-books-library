import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router";
import BookTableContent from "./BookTableContent.jsx";
import APIHandler from "../utils/APIHandler.jsx";
import GetForm from "./BookRoutes/GetForm.jsx";

const booksAPIHandler = new APIHandler("books");

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
