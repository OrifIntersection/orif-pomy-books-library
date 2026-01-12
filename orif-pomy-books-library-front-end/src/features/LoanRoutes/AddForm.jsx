import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");
const loansAPIHandler = new APIHandler("loans");

export default function AddForm() {
  const [book, setBook] = useState();

  const [error, setError] = useState({ get: null, post: null });
  const [success, setSuccess] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id);
        setBook(body.data);
      } catch (error) {
        console.error(error);
        setError((prev) => ({ ...prev, get: error.message }));
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const endDate = e.target.endDate.value;
    try {
      const body = await loansAPIHandler.post({ bookId: book._id, endDate });
      setSuccess(body.message);

      setTimeout(() => {
        navigate(`/livres/${book._id}`);
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError((prev) => ({ ...prev, post: error.message }));
    }
  }

  if (error.get) return <p className="structuredError">{error.get}</p>;

  return book ? (
    <>
      {error.post && <p className="structuredError">{error.post}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
      <p className="structuredInfo">
        Vous souhaitez emprunter: {book.Title} - {book.Author}
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
