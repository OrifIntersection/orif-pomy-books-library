import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

function Option({ value }) {
  return <option>{value}</option>
}

function SelectField({ id, values, setSelection }) {
  return (
    <>
      <label htmlFor={id}>
        {id} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select name={id} onChange={(e) => setSelection(e.target.value)} required>
        {values.map((value) => (
          <Option id={id} value={value}/>
        ))}
      </select>
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

  const [genreSelection, setGenreSelection] = useState();
  const [subjectSelection, setSubjectSelection] = useState();
  const [locationSelection, setLocationSelection] = useState();

  const [customGenre, setCustomGenre] = useState()
  const [customSubject, setCustomSubject] = useState()
  const [customLocation, setCustomLocation] = useState()

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

    const Genre = formData.get("Genre") === "-- Autre --" ? customGenre : formData.get("Genre");
    const Subject = formData.get("Subject") === "-- Autre --" ? customSubject : formData.get("Subject");
    const Location = formData.get("Location") === "-- Autre --" ? customLocation : formData.get("Location");

    try {
      const body = await booksAPIHandler.post({
        Title: formData.get("Title"),
        Author: formData.get("Author").split(", "),
        Genre, Subject, Location
      });

      alert(body.message);

      navigate("/livres/" + body.data._id);
    } catch (error) {
      console.error(error);
      setPostError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return distinctLocations && distinctSubjects && distinctLocations ? (
    <form onSubmit={submitBook} className="bookForm">
      {postError ? <p className="structuredError">{postError}</p> : null}
      <label htmlFor="title">
        Titre <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <input type="text" id="title" name="Title" required />
      <label htmlFor="author">
        Auteur <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <input type="text" id="author" name="Author" required />

      <SelectField key="genre" values={distinctGenres} id="Genre" setSelection={setGenreSelection}/>
      {genreSelection === "-- Autre --" && <input type="text" id="Genre" name="Genre" onChange={(e) => setCustomGenre(e.target.value)}/>}

      <SelectField key="subject" values={distinctSubjects} id="Subject" setSelection={setSubjectSelection}/>
      {subjectSelection === "-- Autre --" && <input type="text" id="Genre" name="Genre" onChange={(e) => setCustomSubject(e.target.value)}/>}

      <SelectField key="location" values={distinctLocations} id="Location" setSelection={setLocationSelection}/>
      {locationSelection === "-- Autre --" && <input type="text" id="Genre" name="Genre" onChange={(e) => setCustomLocation(e.target.value)}/>}

      <input type="submit" value="Envoyer" />
    </form>
  ) : <p className="loadingBar">Loading...</p>;
}