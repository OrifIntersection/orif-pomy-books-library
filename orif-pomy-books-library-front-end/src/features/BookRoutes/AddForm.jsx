import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

function SelectWithOther({ name, values }) {
  const [isOther, setIsOther] = useState(false);

  return (
    <>
      <label htmlFor={name}>
        {name} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select
        name={name}
        onChange={(e) => setIsOther(e.target.value === "-- Autre --")}
        required
      >
        {values.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      {isOther && <input type="text" name={`custom${name}`} />}
    </>
  );
}

export default function AddForm() {
  const navigate = useNavigate();

  const [getError, setGetError] = useState();
  const [postError, setPostError] = useState();

  const [distinctGenres, setDistinctGenres] = useState();
  const [distinctSubjects, setDistinctSubjects] = useState();
  const [distinctLocations, setDistinctLocations] = useState();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await distinctBooksAPIHandler.get();

        body.data.Genres.push("-- Autre --");
        body.data.Subjects.push("-- Autre --");
        body.data.Locations.push("-- Autre --");

        setDistinctGenres(body.data.Genres);
        setDistinctSubjects(body.data.Subjects);
        setDistinctLocations(body.data.Locations);
      } catch (error) {
        console.error(error);
        setGetError(error.message);
      }
    }
    getAPI();
  }, []);

  async function submitBook(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    function getValue(name) {
      return formData.get(name) === "-- Autre --"
        ? formData.get(`custom${name}`)
        : formData.get(name);
    }

    try {
      const body = await booksAPIHandler.post({
        Title: formData.get("Title"),
        Author: formData.get("Author").split(", "),
        Genre: getValue("Genre"),
        Subject: getValue("Subject"),
        Location: getValue("Location"),
      });

      alert(body.message);

      navigate("/livres/" + body.data._id);
    } catch (error) {
      console.error(error);
      setPostError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return distinctGenres && distinctSubjects && distinctLocations ? (
    <form onSubmit={submitBook} className="bookForm">
      {postError ? <p className="structuredError">{postError}</p> : null}
      <label htmlFor="Title">
        Titre <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <input type="text" name="Title" required />
      <label htmlFor="Author">
        Auteur <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <input type="text" name="Author" required />

      <SelectWithOther name="Genre" values={distinctGenres} />
      <SelectWithOther name="Subject" values={distinctSubjects} />
      <SelectWithOther name="Location" values={distinctLocations} />

      <input type="submit" value="Envoyer" />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
