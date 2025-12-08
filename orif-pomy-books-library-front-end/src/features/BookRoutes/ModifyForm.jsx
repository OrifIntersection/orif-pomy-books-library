import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler.jsx";
import { AuthContext } from "../../contexts/AuthContext";

const booksAPIHandler = new APIHandler("books");

export default function ModifyBook() {
  const [book, setBook] = useState({});
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  if (user) booksAPIHandler.setAuth(user.id);

  //
  // useEffect to getBookById from the API and render it
  // runs once on page load to query for getBookById
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id)
        setBook(body.data);
      } catch (error) {
        console.error(error);
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

      await booksAPIHandler.patch({
        Title: formData.get("title"),
        Author: formData.get("author").split(", "),
        Genre: formData.get("genre").split(", "),
        Subject: formData.get("subject").split(", "),
        Location: formData.get("location"),
        ISBN: formData.get("isbn"),
      }, id);

      alert("le livre à été modifié !")

      navigate("/livres/" + id);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la modification du livre");
    }

  }

  return Object.keys(book).length >= 1 ? (
    <form onSubmit={handleFormSubmit} className="modifyForm">
      <label htmlFor="title">Titre: </label>
      <input
        type="text"
        id="title"
        name="title"
        defaultValue={book.Title}
        required
      />
      <label htmlFor="author">Auteur: </label>
      <input
        type="text"
        id="author"
        name="author"
        defaultValue={book.Author.join(", ")}
        required
      />
      <label htmlFor="genre">Genre: </label>
      <input
        type="text"
        id="genre"
        name="genre"
        defaultValue={book.Genre.join(", ")}
        required
      />
      <label htmlFor="subject">Sujet: </label>
      <input
        type="text"
        id="subject"
        name="subject"
        defaultValue={book.Subject.join(", ")}
        required
      />
      <label htmlFor="location">Emplacement: </label>
      <input
        type="text"
        id="location"
        name="location"
        defaultValue={book.Location}
        required
      />
      <label htmlFor="isbn">ISBN: </label>
      <input
        type="text"
        id="isbn"
        name="isbn"
        defaultValue={book.ISBN}
      />
      <input type="submit" value="Envoyer" />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
