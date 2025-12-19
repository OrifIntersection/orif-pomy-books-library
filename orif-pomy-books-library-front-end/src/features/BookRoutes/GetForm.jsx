import { useSearchParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import BookTableContent from "../BookTableContent.jsx";

import APIHandler from "../../utils/APIHandler.jsx";

const booksAPIHandler = new APIHandler("books");

export default function GetForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState();
  const [pageError, setPageError] = useState();

  //
  // function to set search queries to the URL whenever the SearchBookTable form is submitted
  // this will automatically query the API via useEffect
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get(searchParams);
        setBooks(body.data);

        setPageError(null);
      } catch (error) {
        console.error(error);
        setPageError(error.message);

        setBooks(null);
      }
    }
    getAPI();
  }, [setSearchParams]);

  function submitSearch(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const search = formData.get("search");
    const searchType = formData.get("search-type");

    setSearchParams({ search: search, searchType: searchType });
  }

  //
  // This search form will only show when multiple books are available
  // if a single book is found, it will no longer show (see BookTable conditional return)
  //

  return (
    <div className="structuredInfo">
      <form onSubmit={submitSearch} className="searchForm">
        <div>
          <label htmlFor="search-books">Recherche de livres : </label>
          <input type="search" id="search-books" name="search" />
        </div>
        <div>
          <label htmlFor="search-type">
            Selectionnez le type de recherche :{" "}
          </label>
          <select id="search-type" name="search-type">
            <option value="">-- Tous --</option>
            <option value="Title">Titre</option>
            <option value="Author">Auteur</option>
            <option value="Genre">Genre</option>
            <option value="Subject">Sujet</option>
            <option value="Location">Emplacement</option>
          </select>
        </div>
        <input type="submit" value="Recherche" />
      </form>
      {pageError && <p className="structuredError">{pageError}</p>}
      {books ? (
        <BookTableContent
          books={books}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      ) : (
        <p className="loadingBar">Loading...</p>
      )}
    </div>
  );
}
