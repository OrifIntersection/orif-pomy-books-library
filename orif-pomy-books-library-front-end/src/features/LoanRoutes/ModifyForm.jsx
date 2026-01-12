import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const loansAPIHandler = new APIHandler("loans");

export default function ModifyForm() {
  const [loan, setLoan] = useState();

  const [error, setError] = useState({ get: null, patch: null });
  const [success, setSuccess] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await loansAPIHandler.get("", id);
        setLoan(body.data);
      } catch (error) {
        console.error(error);
        setError((prev) => ({ ...prev, get: error.message }));
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const body = await loansAPIHandler.patch(
        { endDate: formData.get("endDate") },
        id
      );
      setSuccess(body.message);

      setTimeout(() => {
        navigate(`/livres/${loan.Book._id}`);
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError((prev) => ({ ...prev, patch: error.message }));
    }
  }

  if (error.get) return <p className="structuredError">{error.get}</p>;

  return loan ? (
    <>
      {error.patch && <p className="structuredError">{error.patch}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
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
