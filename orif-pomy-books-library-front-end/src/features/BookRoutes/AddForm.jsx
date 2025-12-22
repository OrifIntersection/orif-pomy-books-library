import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct")

export default function AddForm() {
  const navigate = useNavigate();
  const [getError, setGetError] = useState();
  const [postError, setPostError] = useState();
  const [distinctFields, setDistinctFields] = useState();

  useEffect(() => {
    async function getAPI() {
      try {
      const body = await distinctBooksAPIHandler.get();
      setDistinctFields(body.data);
      } catch (error) {
      console.error(error);
      setGetError(error.message);
      }
    }
    getAPI();
  }, [])

  console.log(distinctFields);

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

      alert(body.message);

      navigate("/livres/" + body.data._id);
    } catch (error) {
      console.error(error);
      setPostError(error.message)
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>

  return (
    <form onSubmit={submitBook} className="bookForm">
      {postError ? <p className="structuredError">{postError}</p> : null}
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
