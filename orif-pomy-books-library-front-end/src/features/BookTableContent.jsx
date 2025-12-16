import { useNavigate } from "react-router";

function BookTableHead({ searchParams, setSearchParams, books }) {
  function sortBooks(e) {
    //
    // function to set sort queries to the URL whenever a sort button is clicked
    // this will automatically query the API via useEffect
    //

    const sortBy = e.target.name;
    let currentParams = Object.fromEntries([...searchParams]);

    if (currentParams.sortQuery === sortBy) {
      currentParams.sortQuery = `-${sortBy}`;
      setSearchParams(currentParams);
      return;
    }

    currentParams.sortQuery = sortBy;
    setSearchParams(currentParams);
  }

  function sortIcon(column) {
    //
    //  Render icon dynamically based on current sort state
    //  If only one book is available, no sort icon is shown
    //

    if (books.length === 1) return;

    if (!searchParams) return;

    if (searchParams.get("sortQuery") === column) {
      return "↑";
    } else if (searchParams.get("sortQuery") === `-${column}`) {
      return "↓";
    }

    return "⇅";
  }

  return (
    <>
      <th>
        Titre
        <button className="sortButton" name="Title" onClick={sortBooks}>
          {sortIcon("Title")}
        </button>
      </th>
      <th>
        Auteur
        <button className="sortButton" name="Author" onClick={sortBooks}>
          {sortIcon("Author")}
        </button>
      </th>
      <th>
        Genre
        <button className="sortButton" name="Genre" onClick={sortBooks}>
          {sortIcon("Genre")}
        </button>
      </th>
      <th>
        Sujet
        <button className="sortButton" name="Subject" onClick={sortBooks}>
          {sortIcon("Subject")}
        </button>
      </th>
      <th>
        Emplacement
        <button className="sortButton" name="Location" onClick={sortBooks}>
          {sortIcon("Location")}
        </button>
      </th>
      <th>
        Disponilibité
        <button className="sortButton" name="ActiveLoan" onClick={sortBooks}>
          {sortIcon("ActiveLoan")}
        </button>
      </th>
    </>
  );
}

function BookTableBody({ book }) {
  //
  // useNavigate will set the current URL to include the book ID
  // this will query the API -> getBookById
  //

  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/livres/${book._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{book.Title}</td>
      <td>{book.Author.join(", ")}</td>
      <td>{book.Genre.join(", ")}</td>
      <td>{book.Subject.join(", ")}</td>
      <td>{book.Location}</td>
      {book.ActiveLoan ? (
        <td style={{ color: "red" }}>
          Emprunté - Retour le {" "}
          {new Date(book.ActiveLoan.EndDate).toLocaleDateString("fr-FR")}{" "}
        </td>
      ) : (
        <td>Disponible</td>
      )}
    </tr>
  );
}

export default function BookTableContent({
  books,
  searchParams,
  setSearchParams,
}) {
    
  //
  // Renders BookTableHead and BookTableBody
  // (based on the number of books found)
  //

  return (

      <table className="bookTable">
        <thead>
          <tr>
            <BookTableHead
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              books={books}
            />
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookTableBody key={book._id} book={book} />
          ))}
        </tbody>
      </table>

  );
}
