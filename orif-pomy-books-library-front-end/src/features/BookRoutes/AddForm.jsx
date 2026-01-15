import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import SingleSelectWithOther from "../SingleSelectWithOther.jsx";
import SelectWithOther from "../SelectWithOther.jsx";

import useFormSubmit from "../../utils/useFormSubmit.jsx";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

export default function AddForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    Title: "",
    Author: "",
    Genre: [],
    Subject: [],
    Location: "",
  });

  const getForm = useFormSubmit({
    onSubmit: function () {
      return distinctBooksAPIHandler.get();
    },
    onSuccess: function (res) {
      res.data.uniqueGenres.push("-- Autre --");
      res.data.uniqueSubjects.push("-- Autre --");
      res.data.uniqueLocations.push("-- Autre --");
    },
  });

  const postForm = useFormSubmit({
    onSubmit: function () {
      return booksAPIHandler.post(formState);
    },
    onSuccess: function (res) {
      setTimeout(() => {
        navigate("/livres/" + res.data._id);
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, []);

  if (getForm.error) return <p className="structuredError">{getForm.error}</p>;

  if (getForm.loading) return <p className="loadingBar">Loading...</p>;

  return (
    getForm.success && (
      <form onSubmit={(e) => postForm.handleSubmit(e)} className="bookForm">
        {postForm.error && <p className="structuredError">{postForm.error}</p>}
        {postForm.success && (
          <p className="structuredSuccess">{postForm.success}</p>
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
          required
        />

        <SelectWithOther
          label="Genres"
          formName="Genre"
          formState={formState}
          setFormState={setFormState}
          listValues={getForm.res.uniqueGenres}
        />
        <SelectWithOther
          label="Sujets"
          formName="Subject"
          formState={formState}
          setFormState={setFormState}
          listValues={getForm.res.uniqueSubjects}
        />
        <SingleSelectWithOther
          label="Emplacement"
          formName="Location"
          setFormState={setFormState}
          listValues={getForm.res.uniqueLocations}
        />

        <input type="submit" value="Envoyer" />
      </form>
    )
  );
}
