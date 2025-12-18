import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";
import { useState } from "react";

const booksAPIHandler = new APIHandler("books");

export default function AddForm() {
  const navigate = useNavigate();
  const [pageError, setPageError] = useState();

  async function submitBook(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const body = await booksAPIHandler.post({
        Title: formData.get("title"),
        Author: formData.get("author").split(", "),
        Genre: formData.get("genre").split(", "),
        Subject: formData.get("subject").split(", "),
        Location: formData.get("location"),
      });

      alert("le livre à été crée");

      navigate("/livres/" + body.data._id);
    } catch (error) {
      console.error(error);
      setPageError(error.message)
    }
  }

  return (
    <form onSubmit={submitBook} className="bookForm">
      {pageError ? <p className="structuredError">{pageError}</p> : null}
      <label htmlFor="title">
        Titre <span>*</span>:{" "}
      </label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="author">
        Auteur <span>*</span>:{" "}
      </label>
      <input type="text" id="author" name="author" required />
      <label htmlFor="genre">
        Genre <span>*</span>:{" "}
      </label>
      <input type="text" id="genre" name="genre" required />
      <label htmlFor="subject">
        Sujet <span>*</span>:{" "}
      </label>
      <input type="text" id="subject" name="subject" required />
      <label htmlFor="location">
        Emplacement <span>*</span>:{" "}
      </label>
      <input type="text" id="location" name="location" required />
      <input type="submit" value="Envoyer" />
    </form>
  );
}
