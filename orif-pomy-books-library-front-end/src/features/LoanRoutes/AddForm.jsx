import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";
import { AuthContext } from "../../contexts/AuthContext";

const booksAPIHandler = new APIHandler("books");
const loansAPIHandler = new APIHandler("loans");

export default function AddForm() {
  const [book, setBook] = useState();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id);
        setBook(body.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);

  if (user) loansAPIHandler.setAuth(user.id);

  return book ? (
    <>
      <p>
        Vous souhaitez emprunter: {book.Title} - {book.Author.join(", ")}
      </p>
      <p>
        Ce livre est actuellement {book.ActiveLoan ? "emprunté" : "disponible"}.
      </p>
      {book.ActiveLoan ? (
        <p>
          `Ce livre devra être rendu pour: $
          {new Date(book.ActiveLoan.EndDate).toDateString()}`
        </p>
      ) : (
        <form className="borrowForm">
          <label htmlFor="EndDate">
            Veuillez selectionner quand vous souhaitez rendre le livre: {" "}
          </label>
          <input type="date" id="EndDate" name="EndDate" required />
          <input type="submit" value="Emprunter" />
        </form>
      )}
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
