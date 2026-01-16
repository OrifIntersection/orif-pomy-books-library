import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

import useFormSubmit from "../../utils/useFormSubmit";

const loansAPIHandler = new APIHandler("loans");

export default function DeleteForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return loansAPIHandler.get("", id);
    },
  });

  const deleteForm = useFormSubmit({
    onSubmit: function () {
      return loansAPIHandler.delete(id);
    },
    onSuccess: function (res) {
      console.log(res);
      setTimeout(() => {
        navigate(`/livres/${res.data.Book._id}`);
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
      <>
        {deleteForm.error && (
          <p className="structuredError">{deleteForm.error}</p>
        )}
        {deleteForm.success && (
          <p className="structuredSuccess">{deleteForm.success}</p>
        )}
        <p className="structuredInfo">
          Vous souhaitez rendre un emprunt sur le livre:{" "}
          {getForm.res.Book.Title} - {getForm.res.Book.Author}
        </p>
        <p className="structuredInfo">
          Cet emprunt devra être rendu pour:{" "}
          {new Date(getForm.res.EndDate).toLocaleDateString("fr-FR")}
        </p>
        <form onSubmit={deleteForm.handleSubmit}>
          Je confirme que j'ai bien rendu cet emprunt.{" "}
          <input type="submit" value="Rendre" />
        </form>
      </>
    )
  );
}
