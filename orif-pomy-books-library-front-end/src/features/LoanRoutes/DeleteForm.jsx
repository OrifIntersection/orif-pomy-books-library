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

      navigate(`/livres/${loan.Book._id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return loan ? (
    <>

      <p className="structuredInfo">
        Vous souhaitez rendre un emprunt sur le livre: {loan.Book.Title} -{" "}
        {loan.Book.Author.join(", ")}
      </p>

      {loan.Returned ? (
        <p className="structuredInfo">Cet emprunt a déjà été rendu.</p>
      ) : (
        <p className="structuredInfo">
          Ce emprunt devra être rendu pour:{" "}
          {new Date(loan.EndDate).toLocaleDateString("fr-FR")}
        </p>
      )}

      {loan.IsUserLoan && !loan.Returned ? (
        <form onSubmit={handleSubmit}>
          Je confirme que je souhaite rendre cet emprunt.{" "}
          <input type="submit" value="Rendre" />
        </form>
      ) : (
        <p className="structuredInfo">
          Ceci n'est pas votre emprunt, vous ne pouvez pas le rendre.
        </p>
      )}

    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
