import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import APIHandler from "../../utils/APIHandler.jsx";
import useFormSubmit from "../../utils/useFormSubmit.jsx";

import SingleSelectWithOther from "../SingleSelectWithOther.jsx";
import SelectWithOther from "../SelectWithOther.jsx";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

export default function ModifyForm() {
  const [formState, setFormState] = useState({
    Title: "",
    Author: "",
    Genre: [],
    Subject: [],
    Location: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const getDistinctForm = useFormSubmit({
    onSubmit: function () {
      return distinctBooksAPIHandler.get();
    },
    onSuccess: function (res) {
      res.data.uniqueGenres.push("-- Autre --");
      res.data.uniqueSubjects.push("-- Autre --");
      res.data.uniqueLocations.push("-- Autre --");
    },
  });

  const getBookForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.get("", id);
    },
    onSuccess: function (res) {
      setFormState({
        Title: res.data.Title,
        Author: res.data.Author,
        Genre: res.data.Genre,
        Subject: res.data.Subject,
        Location: res.data.Location,
      });
    },
  });

  const patchBookForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.patch(formData, id);
    },
    onSuccess: function (res) {
      setTimeout(() => {
        navigate("/livres/" + res.data._id);
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  useEffect(() => {
    getDistinctForm.handleSubmit();
    getBookForm.handleSubmit();
  }, []);

  console.log(formState);

  if (getBookForm.error || getDistinctForm.error)
    return (
      <p className="structuredError">
        {getBookForm.error || getDistinctForm.error}
      </p>
    );

  if (getBookForm.loading || getDistinctForm.loading)
    return <p className="loadingBar">Loading...</p>;

  return (
    getBookForm.res && (
      <form
        onSubmit={(e) => patchBookForm.handleSubmit(e)}
        className="bookForm"
      >
        {patchBookForm.error && (
          <p className="structuredError">{patchBookForm.error}</p>
        )}
        {patchBookForm.success && (
          <p className="structuredSuccess">{patchBookForm.success}</p>
        )}
        <label htmlFor="Title">
          Titre <span style={{ color: "red" }}>*</span>:{" "}
        </label>
        <input
          type="text"
          name="Title"
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, Title: e.target.value }));
          }}
          defaultValue={formState.Title}
          required
        />
        <label htmlFor="Author">
          Auteur <span style={{ color: "red" }}>*</span>:{" "}
        </label>
        <input
          type="text"
          name="Author"
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, Author: e.target.value }));
          }}
          defaultValue={formState.Author}
          required
        />

        <SelectWithOther
          label="Genres"
          formName="Genre"
          formState={formState}
          setFormState={setFormState}
          listValues={getDistinctForm.res.uniqueGenres}
        />
        <SelectWithOther
          label="Sujets"
          formName="Subject"
          formState={formState}
          setFormState={setFormState}
          listValues={getDistinctForm.res.uniqueSubjects}
        />
        <SingleSelectWithOther
          label="Emplacement"
          formName="Location"
          formState={formState}
          setFormState={setFormState}
          listValues={getDistinctForm.res.uniqueLocations}
        />

        <input type="submit" value="Envoyer" />
      </form>
    )
  );
}
