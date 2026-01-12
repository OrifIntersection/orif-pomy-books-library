import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler.jsx";

const booksAPIHandler = new APIHandler("books");

// Needs to get -> Unique locations
//              -> BookById
//
// Render BookById info, with dropdown menus & tagbuttons on Subjects, Genres + dropdown for location
//
// Then patch   -> BookById

export default function ModifyForm() {
  const [book, setBook] = useState();
  const [error, setError] = useState({ get: null, patch: null });
  const [success, setSuccess] = useState();

  const [distinctValues, setDistinctValues] = useState({
    uniqueGenres: [],
    uniqueSubjects: [],
    uniqueLocations: [],
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await distinctBooksAPIHandler.get();

        body.data.uniqueGenres.push("-- Autre --");
        body.data.uniqueSubjects.push("-- Autre --");
        body.data.uniqueLocations.push("-- Autre --");

        setDistinctValues({
          uniqueGenres: body.data.uniqueGenres,
          uniqueSubjects: body.data.uniqueSubjects,
          uniqueLocations: body.data.uniqueLocations,
        });
      } catch (error) {
        console.error(error);
        setError((prev) => ({ ...prev, get: error.message }));
      }
    }
    getAPI();
  }, []);

  //
  // useEffect to getBookById from the API and render it
  // runs once on page load to query for getBookById
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id);
        setBook(body.data);
        setSelectedGenres(body.data.Genre);
        setSelectedSubjects(body.data.Subject);
      } catch (error) {
        console.error(error);
        setError((prev) => ({ ...prev, get: error.message }));
      }
    }
    getAPI();
  }, []);

  //
  // function to be called when the form is submitted
  // will PATCH the API based on user input
  //

  async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      await booksAPIHandler.patch(
        {
          Title: formData.get("Title"),
          Author: formData.get("Author"),
          Genre: selectedGenres,
          Subject: selectedSubjects,
          Location:
            formData.get("Location") === "-- Autre --"
              ? formData.get("customLocation")
              : formData.get("Location"),
        },
        id
      );

      alert("le livre à été modifié !");

      navigate("/livres/" + id);
    } catch (error) {
      console.error(error);
      setError((prev) => ({ ...prev, patch: error.message }));
    }
  }

  if (error.get) return <p className="structuredError">{error.get}</p>;

  return book ? (
    <form onSubmit={handleFormSubmit} className="modifyForm">
      {error.patch ? <p className="structuredError">{error.patch}</p> : null}
      <label htmlFor="title">Titre: </label>
      <input type="text" name="title" defaultValue={book.Title} required />
      <label htmlFor="author">Auteur: </label>
      <input type="text" name="author" defaultValue={book.Author} required />
      <label htmlFor="genre">Genre: </label>
      <input
        type="text"
        name="genre"
        defaultValue={book.Genre.join(", ")}
        required
      />
      <label htmlFor="subject">Sujet: </label>
      <input
        type="text"
        name="subject"
        defaultValue={book.Subject.join(", ")}
        required
      />
      <label htmlFor="location">Emplacement: </label>
      <input
        type="text"
        name="location"
        defaultValue={book.Location}
        required
      />
      <input type="submit" value="Envoyer" />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
