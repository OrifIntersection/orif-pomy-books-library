import NavButton from "./NavButton.jsx";

export default function SingleBookOptions({ book }) {

  //
  // SingleBookOptions will render options for when a single book is selected
  // we use this book Prop to PATCH, DELETE, POST, get info for loans, etc...
  //

  function checkActiveLoan() {

    // we use the session storage to check if the user has an active loan on this book
    const user = window.sessionStorage.getItem("user");
    let returnDate;

    if (book.ActiveLoan)
      returnDate = new Date(book.ActiveLoan.EndDate).toLocaleDateString(
        "fr-FR"
      );

    if (book.ActiveLoan?.Collaborator === user) {
      return (
        <div>
          <p style={{ color: "red" }}>
            Vous avez emprunté ce livre, le retour est plannifié pour{" "}
            {returnDate}
            <NavButton
              Route={`/emprunts/${book.ActiveLoan._id}/modifier`}
              Content={"Modifier Emprunt"}
            />
            <NavButton
              Route={`/emprunts/${book.ActiveLoan._id}/supprimer`}
              Content={"Rendre Livre"}
            />
          </p>
        </div>
      );
    } else if (book.ActiveLoan) {
      return (
        <p style={{ color: "red" }}>
          Ce livre est emprunté jusqu'au {returnDate}
          <NavButton
            Route={`/collaborateurs/${book.ActiveLoan.Collaborator}`}
            Content={"Plus d'infos"}
          />
        </p>
      );
    }

    return (
      <p>
        Ce livre peut être emprunté
        <NavButton
          Route={`/livres/${book._id}/emprunter`}
          Content={"Emprunter Livre"}
        />
      </p>
    );
  }

  return (
    <div className="singleBookDetails">
      <p>
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
      {checkActiveLoan()}
    </div>
  );
}
