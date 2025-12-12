import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import BookTableContent from "./BookTableContent.jsx";
import APIHandler from "../utils/APIHandler.jsx";
import GetForm from "./BookRoutes/GetForm.jsx";

import NavButton from "./NavButton.jsx";

const booksAPIHandler = new APIHandler("books");

function SingleBook({ book }) {
  //
  // SingleBook only shows when a single book is available
  // we can then use this book ID to update & PATCH the API, or POST the API to borrow the book
  //

  function checkActiveLoan() {
    const user = window.sessionStorage.getItem("user");
    let returnDate;

    if (book.ActiveLoan)
      returnDate = new Date(book.ActiveLoan.EndDate).toLocaleDateString(
        "fr-FR"
      );

    if (book.ActiveLoan?.Collaborator === user) {
      return (
        <div>
          <p style={{ color: "red" }}>
            Vous avez emprunté ce livre, le retour est plannifié pour{" "}
            {returnDate}
            <NavButton
              Route={`/emprunts/${book.ActiveLoan._id}/modifier`}
              Content={"Modifier Emprunt"}
            />
            <NavButton
              Route={`/emprunts/${book.ActiveLoan._id}/supprimer`}
              Content={"Rendre Livre"}
            />
          </p>
        </div>
      );
    } else if (book.ActiveLoan) {
      return (
        <p style={{ color: "red" }}>
          Ce livre est emprunté jusqu'au {returnDate}
          <NavButton
            Route={`/collaborateurs/${book.ActiveLoan.Collaborator}`}
            Content={"Plus d'infos"}
          />
        </p>
      );
    }

    return (
      <p>
        Ce livre peut être emprunté
        <NavButton
          Route={`/livres/${book._id}/emprunter`}
          Content={"Emprunter Livre"}
        />
      </p>
    );
  }

  return (
    <div className="singleBookDetails">
      <p>
        Ce livre a été dernièrement modifié par:{" "}
        {book.ModifiedBy?.Name || "inconnu"} le{" "}
        {new Date(book.ModifiedOn).toLocaleDateString("fr-FR")}
        <NavButton
          Route={`/livres/${book._id}/modifier`}
          Content={"Modifier Livre"}
        />
        <NavButton
          Route={`/livres/${book._id}/supprimer`}
          Content={"Supprimer Livre"}
        />
      </p>

      {checkActiveLoan()}
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
