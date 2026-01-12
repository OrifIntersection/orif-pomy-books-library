import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function DeleteForm() {
  const [book, setBook] = useState();
  const [error, setError] = useState({ get: null, delete: null });
  const [success, setSuccess] = useState();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await collaboratorsAPIHandler.get();
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

    try {
      const body = await collaboratorsAPIHandler.delete();

      setSuccess(body.message);

      window.sessionStorage.removeItem("auth_token");
      window.sessionStorage.removeItem("name");
      setTimeout(() => {
        window.location.assign("/livres");
      }, input.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError((prev) => ({ ...prev, delete: error.message }));
    }
  }

  if (error.get) return <p className="structuredError">{error.get}</p>;

  return book ? (
    <form className="deleteForm" onSubmit={handleSubmit}>
      {error.delete && <p className="structuredError">{error.delete}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
      <p className="structuredInfo">
        Êtes vous sûr de vouloir supprimer votre compte?{" "}
        <span style={{ color: "red" }}>Vos données seront irrécupérables.</span>
      </p>
      <input
        type="submit"
        value="Supprimer Définitivement"
        style={{ color: "red", fontWeight: "bold" }}
      />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
