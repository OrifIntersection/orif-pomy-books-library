import { useParams, useSearchParams } from "react-router";

export default function GetForm({ setSearchParams }) {

  /*   const [searchParams, setSearchParams] = useSearchParams(); */
  /*   const [books, setBooks] = useState();
  const [pageError, setPageError] = useState();
  const { id } = useParams();
  */

  //
  // function to set search queries to the URL whenever the SearchBookTable form is submitted
  // this will automatically query the API via useEffect
  //

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
  );
}