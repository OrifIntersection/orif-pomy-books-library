import { useParams } from "react-router";
import { useEffect } from "react";
import BookTableContent from "../BookTableContent.jsx";
import BookOptions from "../BookOptions.jsx";
import APIHandler from "../../utils/APIHandler.jsx";
import useFormSubmit from "../../utils/useFormSubmit.jsx";

const booksAPIHandler = new APIHandler("books");

export default function GetByIdForm() {
  const { id } = useParams();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.get("", id);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, []);

  if (getForm.error) return <p className="structuredError">{getForm.error}</p>;

  if (getForm.loading) return <p className="loadingBar">Loading...</p>;

  // BookOptions expects a book object
  // BookTableContent expects an array of books (an array of length 1 is fine)

  return (
    getForm.res && (
      <div className="structuredInfo">
        <BookOptions book={getForm.res} />
        <BookTableContent books={[getForm.res]} />
      </div>
    )
  );
}
