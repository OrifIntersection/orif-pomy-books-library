import APIHandler from "../../utils/APIHandler";
import Cross from "../../styles/icons/cross.jsx";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

function StringSelectWithOther({ label, name, listValues }) {
  const [isOther, setIsOther] = useState(false);

  return (
    <>
      <label htmlFor={name}>
        {label} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select
        name={name}
        onChange={(e) => setIsOther(e.target.value === "-- Autre --")}
      >
        <option value="" disabled selected hidden>
          -Veuillez Choisir-
        </option>
        {listValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      {isOther && <input type="text" name={`custom${name}`} />}
    </>
  );
}

function SelectWithOther({
  label,
  selectedValues,
  setSelectedValues,
  listValues,
}) {
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState();

  function handleSelectOnChange(e) {
    if (e.target.value === "-- Autre --") {
      setIsOther(true);
    } else if (selectedValues.includes(e.target.value)) {
      setIsOther(false);
      return;
    } else {
      setIsOther(false);
      setSelectedValues((prev) => [...prev, e.target.value]);
    }
  }

  function handleDeleteButtonOnChange(value, e) {
    setSelectedValues((prev) => prev.filter((el) => el !== value));
  }

  function handleIsOtherAddButton(e) {
    e.preventDefault();

    if (selectedValues.includes(otherValue)) {
      return;
    } else {
      setSelectedValues((prev) => [...prev, otherValue]);
    }
  }

  return (
    <>
      <label>
        {label} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select onChange={handleSelectOnChange}>
        <option value="" disabled selected hidden>
          -Veuillez Choisir-
        </option>
        {listValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      <div>
        {selectedValues.map((value) => (
          <button
            className="selectionButton"
            key={value}
            onClick={() => handleDeleteButtonOnChange(value)}
          >
            {value} <Cross />
          </button>
        ))}
      </div>

      {isOther && (
        <div>
          <input
            type="text"
            onChange={(e) => setOtherValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleIsOtherAddButton(e);
              }
            }}
          />
          <button className="addButton" onClick={handleIsOtherAddButton}>
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

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [distinctValues, setDistinctValues] = useState({
    uniqueGenres: [],
    uniqueSubjects: [],
    uniqueLocations: [],
  });

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await distinctBooksAPIHandler.get();

        body.data.uniqueGenres.push("-- Autre --");
        body.data.uniqueSubjects.push("-- Autre --");
        body.data.uniqueLocations.push("-- Autre --");

        setDistinctValues({
          uniqueGenres: body.data.uniqueGenres,
          uniqueSubjects: body.data.uniqueSubjects,
          uniqueLocations: body.data.uniqueLocations,
        });
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

    try {
      const body = await booksAPIHandler.post({
        Title: formData.get("Title"),
        Author: formData.get("Author"),
        Genre: selectedGenres,
        Subject: selectedSubjects,
        Location:
          formData.get("Location") === "-- Autre --"
            ? formData.get("customLocation")
            : formData.get("Location"),
      });

      alert(body.message);

      navigate("/livres/" + body.data._id);
    } catch (error) {
      console.error(error);
      setPostError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return distinctValues.uniqueGenres &&
    distinctValues.uniqueSubjects &&
    distinctValues.uniqueLocations ? (
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

      <SelectWithOther
        label="Genres"
        selectedValues={selectedGenres}
        setSelectedValues={setSelectedGenres}
        listValues={distinctValues.uniqueGenres}
      />
      <SelectWithOther
        label="Sujets"
        selectedValues={selectedSubjects}
        setSelectedValues={setSelectedSubjects}
        listValues={distinctValues.uniqueSubjects}
      />
      <StringSelectWithOther
        label="Emplacement"
        name="Location"
        listValues={distinctValues.uniqueLocations}
      />

      <input type="submit" value="Envoyer" />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
