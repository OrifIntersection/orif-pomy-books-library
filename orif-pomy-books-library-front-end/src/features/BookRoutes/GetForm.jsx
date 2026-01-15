import { useSearchParams } from "react-router";
import { useEffect } from "react";
import BookTableContent from "../BookTableContent.jsx";
import useFormSubmit from "../../utils/useFormSubmit.jsx";

import APIHandler from "../../utils/APIHandler.jsx";

const booksAPIHandler = new APIHandler("books");

export default function GetForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.get(searchParams);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, [setSearchParams]);

  function submitSearch(e) {
    //
    // function to set search queries to the URL whenever the SearchBookTable form is submitted
    // this will automatically query the API via useEffect
    // setSearchParams & searchParams are used by BookTableContent to handle the column sort buttons!
    //

    e.preventDefault();

    const formData = new FormData(e.target);

    const search = formData.get("search");
    const searchType = formData.get("search-type");

    setSearchParams({ search: search, searchType: searchType });
  }

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
      {getForm.error && <p className="structuredError">{getForm.error}</p>}
      {getForm.res ? (
        <BookTableContent
          books={getForm.res}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      ) : (
        <p className="loadingBar">Loading...</p>
      )}
    </div>
  );
}
