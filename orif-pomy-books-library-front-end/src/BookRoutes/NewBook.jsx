import APIHandler from "../utils/APIHandler";
import { useNavigate } from "react-router";

const booksAPIHandler = new APIHandler("books")

export default function NewBook() {
  const navigate = useNavigate();

  async function submitBook(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      await booksAPIHandler.post({
        Title: formData.get("title"),
        Author: formData.get("author").split(", "),
        Genre: formData.get("genre").split(", "),
        Subject: formData.get("subject").split(", "),
        Location: formData.get("location"),
        ISBN: formData.get("isbn"),
      });

      alert("le livre à été crée");

      navigate("/books");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la création du livre");
    }

  }

  return (
    <form onSubmit={submitBook} className="bookForm">
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
      <label htmlFor="isbn">ISBN: </label>
      <input type="text" id="isbn" name="isbn" />
      <input type="submit" value="Envoyer" />
    </form>
  );
}
