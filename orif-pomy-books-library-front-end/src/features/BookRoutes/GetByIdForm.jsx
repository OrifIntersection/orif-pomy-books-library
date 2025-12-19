import { useParams } from "react-router";
import { useState, useEffect } from "react";
import BookTableContent from "../BookTableContent.jsx";
import SingleBookOptions from "../SingleBookOptions.jsx";

import APIHandler from "../../utils/APIHandler.jsx";

const booksAPIHandler = new APIHandler("books");

export default function GetByIdForm() {
  const { id } = useParams();
  const [book, setBook] = useState();
  const [pageError, setPageError] = useState();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id);
        setBook([body.data]); // Must be an array for BookTableContent

        setPageError(null);
      } catch (error) {
        console.error(error);
        setPageError(error.message);

        setBook(null);
      }
    }
    getAPI();
  }, [id]);

  //
  // This search form will only show when multiple books are available
  // if a single book is found, it will no longer show (see BookTable conditional return)
  //

  if (pageError) return <p className="structuredError">{pageError}</p>;

  return book ? (
    <div className="structuredInfo">
      <SingleBookOptions book={book} />
      <BookTableContent books={book} />
    </div>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
