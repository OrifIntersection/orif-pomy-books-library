import NavButton from "./NavButton.jsx";
import LoanOptions from "./LoanOptions.jsx";

export default function BookOptions({ book }) {

  //
  // BookOptions will render options for when a book is selected by ID
  // we use this book Prop to PATCH, DELETE, POST, get info for loans, etc...
  //

  return (
    <div className="singleBookDetails">
      <p className="structuredInfo">
        Ce livre a été dernièrement modifié par:{" "}
        {book.ModifiedBy?.Name || "inconnu"} le{" "}
        {new Date(book.ModifiedOn).toLocaleDateString("fr-FR")}
        <NavButton
          Route={`/livres/${book._id}/modifier`}
          Content={"Modifier Livre"}
        />
        <NavButton
          Route={`/livres/${book._id}/supprimer`}
          Content={"Supprimer Livre"}
        />
      </p>
      <LoanOptions book={book} />
    </div>
  );
}
