import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";

import APIHandler from "../utils/APIHandler.jsx";

import BookTableContent from "./BookTableContent.jsx";
import GetForm from "./BookRoutes/GetForm.jsx";
import SingleBookOptions from "./SingleBookOptions.jsx";

const booksAPIHandler = new APIHandler("books");

export default function BookTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState();
  const [pageError, setPageError] = useState();
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
        setPageError(null);
      } catch (error) {
        console.error(error);
        setPageError(error.message);
      }
    }
    getAPI();
  }, [id, setSearchParams]);

  //
  // need to fix for if an ID has correct syntax but doesn't exist
  // returns an emtpy object on setBooks => [{}]
  //

  if (books && books.length === 1) return (
    <div className="structuredInfo">
      <SingleBookOptions book={books[0]} />
      <BookTableContent
          books={books}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
      />
    </div>
  )

  if (books)
    return (
      <div className="structuredInfo">
        <GetForm setSearchParams={setSearchParams} />
        {pageError ? (
          <p className="structuredError">{pageError}</p>
        ) : (
          <BookTableContent
            books={books}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
      </div>
    );

  return <p className="loadingBar">Loading...</p>;
}

