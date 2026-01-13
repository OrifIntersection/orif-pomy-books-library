import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler";

import useFormSubmit from "../../utils/useFormSubmit.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function DeleteForm() {
  const [book, setBook] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await collaboratorsAPIHandler.get();
        setBook(body.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
    getAPI();
  }, []);

  const deleteForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.delete();
    },
    onSuccess: function () {
      setTimeout(() => {
        navigate("/livres");
      }, input.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  if (error) return <p className="structuredError">{error}</p>;

  return book ? (
    <form className="deleteForm" onSubmit={handleSubmit}>
      {deleteForm.error && (
        <p className="structuredError">{deleteForm.error}</p>
      )}
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
