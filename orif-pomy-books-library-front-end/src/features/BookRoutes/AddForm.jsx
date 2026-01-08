import APIHandler from "../../utils/APIHandler";
import Cross from "../../styles/icons/cross.jsx";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const booksAPIHandler = new APIHandler("books");
const distinctBooksAPIHandler = new APIHandler("books/distinct");

function StringSelectWithOther({ name, values }) {
  const [isOther, setIsOther] = useState(false);

  return (
    <>
      <label htmlFor={name}>
        {name} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select
        name={name}
        onChange={(e) => setIsOther(e.target.value === "-- Autre --")}
      >
        {values[name].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      {isOther && <input type="text" name={`custom${name}`} />}
    </>
  );
}

function SelectWithOther({
  name,
  selectionValues,
  setSelectionValues,
  values,
}) {
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState();

  function handleSelectOnChange(e) {
    if (e.target.value === "-- Autre --") {
      setIsOther(true);
    } else if (selectionValues[name].includes(e.target.value)) {
      setIsOther(false);
      return;
    } else {
      setIsOther(false);
      setSelectionValues((prev) => ({
        ...prev,
        [name]: [...prev[name], e.target.value],
      }));
    }
  }

  function handleDeleteButtonOnChange(value, e) {
    setSelectionValues((prev) => ({
      ...prev,
      [name]: prev[name].filter((el) => el !== value),
    }));
  }

  function handleIsOtherAddButton(e) {
    e.preventDefault();
    if (selectionValues[name].includes(otherValue)) {
      return;
    } else {
      setSelectionValues((prev) => ({
        ...prev,
        [name]: [...prev[name], otherValue],
      }));
    }
  }

  return (
    <>
      <label htmlFor={name}>
        {name} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select name={name} onChange={handleSelectOnChange}>
        {values[name].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      <div>
        {selectionValues[name].map((value) => (
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
          <input type="text" onChange={(e) => setOtherValue(e.target.value)} />
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

  const [distinctValues, setDistinctValues] = useState({
    Genres: [],
    Sujets: [],
    Emplacement: [],
  });

  const [selectionValues, setSelectionValues] = useState({
    Genres: [],
    Sujets: [],
  });

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await distinctBooksAPIHandler.get();

        body.data.Genres.push("-- Autre --");
        body.data.Subjects.push("-- Autre --");
        body.data.Locations.push("-- Autre --");

        setDistinctValues({
          Genres: body.data.Genres,
          Sujets: body.data.Subjects,
          Emplacement: body.data.Locations,
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

    console.log({
      Title: formData.get("Title"),
      Author: formData.get("Author"),
      Genre: selectionValues.Genres,
      Subject: selectionValues.Sujets,
      Location:
        formData.get("Emplacement") === "-- Autre --"
          ? formData.get("customEmplacement")
          : formData.get("Emplacement"),
    });

    try {
      const body = await booksAPIHandler.post({
        Title: formData.get("Title"),
        Author: formData.get("Author"),
        Genre: selectionValues.Genres,
        Subject: selectionValues.Sujets,
        Location:
          formData.get("Emplacement") === "-- Autre --"
            ? formData.get("customEmplacement")
            : formData.get("Emplacement"),
      });

      alert(body.message);

      navigate("/livres/" + body.data._id);
    } catch (error) {
      console.error(error);
      setPostError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return distinctValues.Genres &&
    distinctValues.Sujets &&
    distinctValues.Emplacement ? (
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
        name="Genres"
        selectionValues={selectionValues}
        setSelectionValues={setSelectionValues}
        values={distinctValues}
      />
      <SelectWithOther
        name="Sujets"
        selectionValues={selectionValues}
        setSelectionValues={setSelectionValues}
        values={distinctValues}
      />
      <StringSelectWithOther name="Emplacement" values={distinctValues} />

      <input type="submit" value="Envoyer" />
    </form>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
