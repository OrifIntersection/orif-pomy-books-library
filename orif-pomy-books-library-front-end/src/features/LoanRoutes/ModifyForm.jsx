import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

import useFormSubmit from "../../utils/useFormSubmit";

const loansAPIHandler = new APIHandler("loans");

export default function ModifyForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return loansAPIHandler.get("", id);
    },
  });

  const patchForm = useFormSubmit({
    onSubmit: function (values) {
      return loansAPIHandler.patch({ endDate: values.endDate }, id);
    },
    onSuccess: function (res) {
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
        {patchForm.error && (
          <p className="structuredError">{patchForm.error}</p>
        )}
        {patchForm.success && (
          <p className="structuredSuccess">{patchForm.success}</p>
        )}
        <p className="structuredInfo">
          Vous souhaitez modifier votre emprunt sur le livre:{" "}
          {getForm.res.Book.Title} - {getForm.res.Book.Author}
        </p>
        <p className="structuredInfo">
          Cet emprunt devra être rendu pour:{" "}
          {new Date(getForm.res.EndDate).toLocaleDateString("fr-FR")}
        </p>
        <form className="borrowForm" onSubmit={patchForm.handleSubmit}>
          <label htmlFor="endDate">
            Veuillez selectionner quand vous souhaitez rendre le livre:{" "}
          </label>
          <input type="date" id="endDate" name="endDate" required />
          <input type="submit" value="Emprunter" />
        </form>
      </>
    )
  );
}
