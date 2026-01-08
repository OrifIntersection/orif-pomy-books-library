import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler.jsx";

const booksAPIHandler = new APIHandler("books");

export default function ModifyForm() {
  const [book, setBook] = useState();
  const [getError, setGetError] = useState();
  const [patchError, setPatchError] = useState();
  const [distinctValues, setDistinctValues] = useState({
    Genres: [],
    Sujets: [],
    Emplacement: [],
  });

  const [selectionValues, setSelectionValues] = useState({
    Genres: [],
    Sujets: [],
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await distinctBooksAPIHandler.get();

        body.data.Genres.push("-- Autre --");
        body.data.Subjects.push("-- Autre --");
        body.data.Locations.push("-- Autre --");

        setDistinctValues({
          Genres: body.data.Genres,
          Sujets: body.data.Subjects,
          Emplacement: body.data.Locations,
        });
      } catch (error) {
        console.error(error);
        setGetError(error.message);
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
        setSelectionValues({
          Genres: body.data.Genre,
          Sujets: body.data.Subject,
        });
      } catch (error) {
        console.error(error);
        setGetError(error.message);
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
          Title: formData.get("title"),
          Author: formData.get("author"),
          Genre: [formData.get("genre")],
          Subject: [formData.get("subject")],
          Location: formData.get("location"),
        },
        id
      );

      alert("le livre à été modifié !");

      navigate("/livres/" + id);
    } catch (error) {
      console.error(error);
      setPatchError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return book ? (
    <form onSubmit={handleFormSubmit} className="modifyForm">
      {patchError ? <p className="structuredError">{patchError}</p> : null}
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
