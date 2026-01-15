import APIHandler from "../../utils/APIHandler";
import { useEffect } from "react";
import BookTableContent from "../BookTableContent.jsx";
import NavButton from "../NavButton.jsx";
import LogoutButton from "./UserLogout.jsx";

import useFormSubmit from "../../utils/useFormSubmit.jsx";

// Get specifically the current logged in user's info
const collaboratorsAPIHandler = new APIHandler("collaborators/me");
const loansAPIHandler = new APIHandler("loans");

export default function UserPage() {
  const getLoansForm = useFormSubmit({
    onSubmit: function () {
      return loansAPIHandler.get({
        mine: true,
        returned: false,
      });
    },
  });

  const getCollabForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.get();
    },
  });

  useEffect(() => {
    getLoansForm.handleSubmit();
    getCollabForm.handleSubmit();
  }, []);

  //
  // BookTableContext expects books that contain an ActiveLoan on Book.ActiveLoan
  // ActiveLoan is not populated via the loansAPIHandler
  // so we populate them manually via the Book inside each loan object
  // => Returns an array of Books where Book.ActiveLoan is populated
  //

  const fixedBooks = getLoansForm.res
    ? getLoansForm.res.map((loan) => {
        loan.Book.ActiveLoan = loan;
        return loan.Book;
      })
    : null;

  if (getLoansForm.loading || getCollabForm.loading)
    return <p className="loadingBar">loading...</p>;

  return (
    <>
      <p className="structuredInfo">Bienvenue {getCollabForm.res?.Name} !</p>
      <LogoutButton />
      <NavButton
        Route="/collaborateurs/moi/modifier"
        Content="Modifier mon profil"
      />
      <NavButton
        Route="/collaborateurs/moi/supprimer"
        Content="Supprimer mon profil"
      />
      {getCollabForm.error && (
        <p className="structuredError">{getCollabForm.error}</p>
      )}
      {getLoansForm.error && (
        <p className="structuredError">{getLoansForm.error}</p>
      )}
      {fixedBooks && getCollabForm.res && (
        <div className="structuredInfo">
          Vos livres empruntés (cliquez sur un livre pour plus de détails):
          <BookTableContent books={fixedBooks} />
        </div>
      )}
    </>
  );
}
