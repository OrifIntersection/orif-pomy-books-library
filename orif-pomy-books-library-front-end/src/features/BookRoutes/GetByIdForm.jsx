import { useParams } from "react-router";
import { useState, useEffect } from "react";
import BookTableContent from "../BookTableContent.jsx";
import BookOptions from "../BookOptions.jsx";

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

  if (pageError) return <p className="structuredError">{pageError}</p>;

  // BookOptions expects a  book object
  // BookTableContent expects an array of books (an array of length 1 is fine)

  return book ? (
    <div className="structuredInfo">
      <BookOptions book={book[0]} />
      <BookTableContent books={book} />
    </div>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
