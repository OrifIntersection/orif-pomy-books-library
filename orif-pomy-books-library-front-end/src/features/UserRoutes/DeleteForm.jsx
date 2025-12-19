import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function DeleteForm() {
  const [book, setBook] = useState();
  const [getError, setGetError] = useState();
  const [deleteError, setDeleteError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await collaboratorsAPIHandler.get();
        setBook(body.data);
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
      await collaboratorsAPIHandler.delete();
      alert("Votre compte à été supprimé");

      window.sessionStorage.removeItem("auth_token");
      window.sessionStorage.removeItem("name");
      window.location.assign("/livres");
    } catch (error) {
      console.error(error);
      setDeleteError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return book ? (
    <form className="deleteForm" onSubmit={handleSubmit}>
      {deleteError ? <p className="structuredError">{deleteError}</p> : null}
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
