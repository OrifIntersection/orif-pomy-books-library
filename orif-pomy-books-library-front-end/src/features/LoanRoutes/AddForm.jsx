import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");
const loansAPIHandler = new APIHandler("loans");

export default function AddForm() {
  const [book, setBook] = useState();
  const [getError, setGetError] = useState();
  const [postError, setPostError] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id);
        setBook(body.data);
      } catch (error) {
        console.error(error);
        setGetError(error.message);
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const endDate = e.target.endDate.value;
    try {
      await loansAPIHandler.post({ bookId: book._id, endDate });
      alert("Le livre a été emprunté avec succès !");

      navigate(`/livres/${book._id}`);
    } catch (error) {
      console.error(error);
      setPostError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return book ? (
    <>
      {postError ? <p className="structuredError">{postError}</p> : null}
      <p className="structuredInfo">
        Vous souhaitez emprunter: {book.Title} - {book.Author.join(", ")}
      </p>
      <form className="borrowForm" onSubmit={handleSubmit}>
        <label htmlFor="endDate">
          Veuillez selectionner quand vous souhaitez rendre le livre:{" "}
        </label>
        <input type="date" id="endDate" name="endDate" required />
        <input type="submit" value="Emprunter" />
      </form>
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
