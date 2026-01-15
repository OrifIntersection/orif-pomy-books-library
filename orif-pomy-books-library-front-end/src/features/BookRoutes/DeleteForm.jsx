import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";
import useFormSubmit from "../../utils/useFormSubmit";

const booksAPIHandler = new APIHandler("books");

export default function DeleteForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.get("", id);
    },
  });

  const deleteForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.delete(id);
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
    getForm.res && (
      <form className="deleteForm" onSubmit={deleteForm.handleSubmit}>
        {deleteForm.error && (
          <p className="structuredError">{deleteForm.error}</p>
        )}
        {deleteForm.success && (
          <p className="structuredSuccess">{deleteForm.success}</p>
        )}
        <p className="structuredInfo">
          Êtes vous sûr de vouloir supprimer "{getForm.res.Title}" ?
        </p>
        <input
          type="submit"
          value="Supprimer"
          style={{ color: "red", fontWeight: "bold" }}
        />
      </form>
    )
  );
}
