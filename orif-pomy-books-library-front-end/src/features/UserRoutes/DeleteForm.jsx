import { useEffect } from "react";
import { useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler";

import useFormSubmit from "../../utils/useFormSubmit.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function DeleteForm() {
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.get();
    },
  });

  const deleteForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.delete();
    },
    onSuccess: function () {
      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, []);

  if (getForm.error) return <p className="structuredError">{getForm.error}</p>;

  if (getForm.loading) return <p className="loadingBar">Loading...</p>;

  return (
    <form className="deleteForm" onSubmit={deleteForm.handleSubmit}>
      {deleteForm.error && (
        <p className="structuredError">{deleteForm.error}</p>
      )}
      {deleteForm.success && (
        <p className="structuredSuccess">{deleteForm.success}</p>
      )}
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
  );
}
