import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const loansAPIHandler = new APIHandler("loans");

export default function ModifyForm() {
  const [loan, setLoan] = useState();
  const [getError, setGetError] = useState();
  const [patchError, setPatchError] = useState();
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

    const formData = new FormData(e.target);

    try {
      await loansAPIHandler.patch({ endDate: formData.get("endDate") }, id);
      alert("Votre emprunt à été modifié avec succès !");

      navigate(`/livres/${loan.Book._id}`);
    } catch (error) {
      console.error(error);
      setPatchError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return loan ? (
    <>
      {patchError && <p className="structuredError">{patchError}</p>}
      <p className="structuredInfo">
        Vous souhaitez modifier votre emprunt sur le livre: {loan.Book.Title} -{" "}
        {loan.Book.Author}
      </p>
      <p className="structuredInfo">
        Cet emprunt devra être rendu pour:{" "}
        {new Date(loan.EndDate).toLocaleDateString("fr-FR")}
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
