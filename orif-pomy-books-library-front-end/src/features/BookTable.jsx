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
    <div className="structuredInfo">
      {books.length === 1 ? (
        <SingleBookOptions book={books[0]} />
      ) : (
        <GetForm setSearchParams={setSearchParams} />
      )}
      <BookTableContent
        books={books}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
