import NavButton from "./NavButton.jsx";

export default function LoanOptions({ book }) {
  //
  // This component checks the loan details on the book prop
  // Then renders the corresponding options accordingly
  //

  if (book.HasUserLoan) {
    return (
      <p style={{ color: "red" }} className="structuredInfo">
        Vous avez emprunté ce livre, le retour est plannifié pour{" "}
        {new Date(book.ActiveLoan.EndDate).toLocaleDateString("fr-FR")}
        <NavButton
          Route={`/emprunts/${book.ActiveLoan._id}/modifier`}
          Content={"Modifier Emprunt"}
        />
        <NavButton
          Route={`/emprunts/${book.ActiveLoan._id}/supprimer`}
          Content={"Rendre Livre"}
        />
      </p>
    );
  } else if (book.ActiveLoan) {
    return (
      <p style={{ color: "red" }} className="structuredInfo">
        Ce livre est emprunté jusqu'au{" "}
        {new Date(book.ActiveLoan.EndDate).toLocaleDateString("fr-FR")}
        <NavButton
          Route={`/collaborateurs/${book.ActiveLoan.Collaborator}`}
          Content={"Plus d'infos"}
        />
      </p>
    );
  }

  return (
    <p className="structuredInfo">
      Ce livre peut être emprunté
      <NavButton
        Route={`/livres/${book._id}/emprunter`}
        Content={"Emprunter Livre"}
      />
    </p>
  );
}
