import { useNavigate } from "react-router";
import SortButton from "./SortButton.jsx";

function BookTableHead({ searchParams, setSearchParams, columnName }) {
  return (
    <th>
      {Object.keys(columnName)[0]}
      <SortButton
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        columnName={Object.values(columnName)[0]}
      />
    </th>
  );
}

function BookTableBody({ book }) {
  //
  // useNavigate will set the current URL to include the book ID
  // this will query the API -> getBookById
  //

  const navigate = useNavigate();

  console.log(book);

  return (
    <tr
      onClick={() => navigate(`/livres/${book._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{book.Title}</td>
      <td>{book.Author}</td>
      <td>{book.Genre.join(", ")}</td>
      <td>{book.Subject.join(", ")}</td>
      <td>{book.Location}</td>
      {book.ActiveLoan ? (
        <td style={{ color: "red" }}>
          Emprunté - Retour le{" "}
          {new Date(book.ActiveLoan.EndDate).toLocaleDateString("fr-FR")}{" "}
        </td>
      ) : (
        <td style={{ color: "green" }}>Disponible</td>
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

  const tableColumnNames = [
    { Titre: "Title" },
    { Auteur: "Author" },
    { Genre: "Genre" },
    { Sujet: "Subject" },
    { Emplacement: "Location" },
    { Disponibilité: "ActiveLoan" },
  ];

  return (
    <table className="bookTable">
      <thead>
        <tr>
          {tableColumnNames.map((columnName) => (
            <BookTableHead
              key={Object.keys(columnName)[0]}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              columnName={columnName}
            />
          ))}
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
