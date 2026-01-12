import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");

export default function DeleteForm() {
  const [book, setBook] = useState();

  const [error, setError] = useState({ get: null, delete: null });
  const [success, setSuccess] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  //
  // useEffect to getBookById from the API
  // runs once on page load to query for getBookById
  //

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

  //
  // function to delete the book at the given ID
  //

  async function deleteBook(e) {
    e.preventDefault();

    try {
      const body = await booksAPIHandler.delete(id);
      setSuccess(body.message);
      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError((prev) => ({ ...prev, delete: error.message }));
    }
  }

  if (error.get) return <p className="structuredError">{error.get}</p>;

  return book ? (
    <form className="deleteForm" onSubmit={deleteBook}>
      {error.delete && <p className="structuredError">{error.delete}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
      <p className="structuredInfo">
        Êtes vous sûr de vouloir supprimer "{book.Title}" ?
      </p>
      <input
        type="submit"
        value="Supprimer"
        style={{ color: "red", fontWeight: "bold" }}
      />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
