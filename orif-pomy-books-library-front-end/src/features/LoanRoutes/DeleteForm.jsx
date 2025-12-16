import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");
const loansAPIHandler = new APIHandler("loans");

export default function DeleteForm() {
  const [book, setBook] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await loansAPIHandler.get("", id);
        setBook(body.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await loansAPIHandler.delete(id);
      alert("Votre livre à été rendu avec succès !");

      navigate(`/livres/${book._id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return book ? (
    <>
      <p className="structuredInfo">
        Vous souhaitez rendre le livre: {book.Title} - {book.Author.join(", ")}
      </p>
      <p className="structuredInfo">
        Ce livre est actuellement {book.ActiveLoan ? "emprunté" : "disponible"}.
      </p>
      {book.ActiveLoan ? (
        <form className="deleteForm" onSubmit={handleSubmit}>
          <input type="submit" value="Rendre" />
        </form>
      ) : (
        <p className="structuredInfo">
          Ce livre n'est pas emprunté, vous ne pouvez pas le rendre.
        </p>
      )}
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
