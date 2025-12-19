import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const loansAPIHandler = new APIHandler("loans");

export default function DeleteForm() {
  const [loan, setLoan] = useState();
  const [getError, setGetError] = useState();
  const [deleteError, setDeleteError] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await loansAPIHandler.get("", id);
        setLoan(body.data);
      } catch (error) {
        console.error(error);
        setGetError(error.message);
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await loansAPIHandler.delete(id);
      alert("Votre livre à été rendu avec succès !");

      navigate(`/livres/${loan.Book._id}`);
    } catch (error) {
      console.error(error);
      setDeleteError(error.message)
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return loan ? (
    <>
      {deleteError ? <p className="structuredError">{deleteError}</p> : null}
      <p className="structuredInfo">
        Vous souhaitez rendre un emprunt sur le livre: {loan.Book.Title} -{" "}
        {loan.Book.Author.join(", ")}
      </p>
      <p className="structuredInfo">
        Cet emprunt devra être rendu pour:{" "}
        {new Date(loan.EndDate).toLocaleDateString("fr-FR")}
      </p>
      <form onSubmit={handleSubmit}>
        Je confirme que j'ai bien rendu cet emprunt.{" "}
        <input type="submit" value="Rendre" />
      </form>
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
