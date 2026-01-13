import APIHandler from "../../utils/APIHandler";
import { useEffect, useState } from "react";
import BookTableContent from "../BookTableContent.jsx";
import NavButton from "../NavButton.jsx";
import { useNavigate } from "react-router";

// Get specifically the current logged in user's info
const collaboratorsAPIHandler = new APIHandler("collaborators/me");
const loansAPIHandler = new APIHandler("loans");

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    window.sessionStorage.removeItem("auth_token");
    window.sessionStorage.removeItem("name");
    alert("Vous êtes déconnecté.");

    navigate("/livres");
  }

  return (
    <button onClick={handleLogout} className="navButton">
      Se déconnecter
    </button>
  );
}

export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [userLoans, setUserLoans] = useState(null);

  const [error, setError] = useState();

  useEffect(() => {
    async function getAPI() {
      try {
        // we query the API for loans that belong to the current user & are not returned yet
        const collaboratorBody = await collaboratorsAPIHandler.get();
        const loansBody = await loansAPIHandler.get({
          mine: true,
          returned: false,
        });

        setUserInfo(collaboratorBody.data);
        setUserLoans(loansBody.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
    getAPI();
  }, []);

  //
  // BookTableContext expects books that contain an ActiveLoan on Book.ActiveLoan
  // ActiveLoan is not populated via the loansAPIHandler
  // so we populate them manually via the Book inside each loan object
  // => Returns an array of Books where Book.ActiveLoan is populated
  //

  const fixedBooks = userLoans
    ? userLoans.map((loan) => {
        loan.Book.ActiveLoan = loan;
        return loan.Book;
      })
    : null;

  return (
    <>
      <p className="structuredInfo">Bienvenue {userInfo?.Name} !</p>
      <LogoutButton />
      <NavButton
        Route="/collaborateurs/moi/modifier"
        Content="Modifier mon profil"
      />
      <NavButton
        Route="/collaborateurs/moi/supprimer"
        Content="Supprimer mon profil"
      />
      {fixedBooks && userInfo ? (
        <div className="structuredInfo">
          Vos livres empruntés (cliquez sur un livre pour plus de détails):
          <BookTableContent books={fixedBooks} />
        </div>
      ) : error ? (
        <p className="structuredError">{error}</p>
      ) : (
        <p className="loadingBar">Loading...</p>
      )}
    </>
  );
}
