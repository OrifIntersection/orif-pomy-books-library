import APIHandler from "../../utils/APIHandler";
import Cross from "../../styles/icons/cross.jsx";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

function SelectWithOther({ name, values }) {
  const [selectionValues, setSelectionValues] = useState([]);
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState();

  return (
    <>
      <label htmlFor={name}>
        {name} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select
        name={name}
        onChange={(e) =>
          e.target.value === "-- Autre --"
            ? setIsOther(true)
            : setSelectionValues((prevValue) =>
                prevValue.includes(e.target.value)
                  ? prevValue
                  : [...prevValue, e.target.value]
              )
        }
      >
        {values.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      <div>
        {selectionValues.map((value) => (
          <button
            className="selectionButton"
            key={value}
            onClick={() =>
              setSelectionValues((prevValue) =>
                prevValue.filter((v) => v !== value)
              )
            }
          >
            {value} <Cross />
          </button>
        ))}
      </div>

      {isOther && (
        <div>
          <input type="text" onChange={(e) => setOtherValue(e.target.value)} />
          <button
            className="addButton"
            onClick={(e) => {
              e.preventDefault();
              setSelectionValues((prevValue) =>
                prevValue.includes(otherValue)
                  ? prevValue
                  : [...prevValue, otherValue]
              );
            }}
          >
            Ajouter
          </button>
        </div>
      )}
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

    console.log(formData.get("Genre"));
    console.log(formData.get("Subject"));
    console.log(formData.get("Location"));

    try {
      const body = await booksAPIHandler.post({
        Title: formData.get("Title"),
        Author: formData.get("Author"),
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

  distinctGenres && console.log(distinctGenres);

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
