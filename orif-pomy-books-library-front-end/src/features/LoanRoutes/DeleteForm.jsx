import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const loansAPIHandler = new APIHandler("loans");

export default function DeleteForm() {
  const [loan, setLoan] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await loansAPIHandler.get("", id);
        setLoan(body.data);
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

  return loan ? (
    <>
      <p className="structuredInfo">
        Vous souhaitez rendre le livre: {loan.Book.Title} -{" "}
        {loan.Book.Author.join(", ")}
      </p>
      <p className="structuredInfo">
        Ce livre devra être rendu pour:{" "}
        {new Date(loan.EndDate).toLocaleDateString("fr-FR")}
      </p>
      {loan.IsUserLoan ? (
        <form onSubmit={handleSubmit}>
          Je confirme que je souhaite rendre ce livre.{" "}
          <input type="submit" value="Rendre" />
        </form>
      ) : (
        <p className="structuredInfo">
          Ce livre n'est pas emprunté par vous, vous ne pouvez pas le rendre.
        </p>
      )}
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
