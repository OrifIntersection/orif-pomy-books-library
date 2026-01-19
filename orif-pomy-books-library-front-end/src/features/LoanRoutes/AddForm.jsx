import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

import useFormSubmit from "../../utils/useFormSubmit";

const booksAPIHandler = new APIHandler("books");
const loansAPIHandler = new APIHandler("loans");

export default function AddForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.get("", id);
    },
  });

  const postForm = useFormSubmit({
    onSubmit: function (values) {
      return loansAPIHandler.post({
        bookId: getForm.res._id,
        endDate: values.endDate,
      });
    },
    onSuccess: function (res) {
      setTimeout(() => {
        navigate(`/livres/${res.data.Book}`);
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
        {postForm.error && <p className="structuredError">{postForm.error}</p>}
        {postForm.loading && <p className="structuredSuccess">Chargement...</p>}
        {postForm.success && (
          <p className="structuredSuccess">{postForm.success}</p>
        )}
        <p className="structuredInfo">
          Vous souhaitez emprunter: {getForm.res.Title} - {getForm.res.Author}
        </p>
        <form className="borrowForm" onSubmit={postForm.handleSubmit}>
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
