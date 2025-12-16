import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");
const loansAPIHandler = new APIHandler("loans");

export default function AddForm() {
  const [book, setBook] = useState();
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

  async function handleSubmit(e) {
    e.preventDefault();
    const EndDate = e.target.EndDate.value;
    try {
      await loansAPIHandler.post({ BookID: book._id, EndDate });
      alert("Le livre a été emprunté avec succès !");

      navigate(`/livres/${book._id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return book ? (
    <>
      <p className="structuredInfo">
        Vous souhaitez emprunter: {book.Title} - {book.Author.join(", ")}
      </p >
      <p className="structuredInfo">
        Ce livre est actuellement {book.ActiveLoan ? "emprunté" : "disponible"}.
      </p>
      {book.ActiveLoan ? (
        <p className="structuredInfo">
          Ce livre devra être rendu pour:{" "}
          {new Date(book.ActiveLoan.EndDate).toDateString()}
        </p>
      ) : (
        <form className="borrowForm" onSubmit={handleSubmit}>
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
