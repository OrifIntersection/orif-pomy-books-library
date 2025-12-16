import APIHandler from "../../utils/APIHandler";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import BookTableContent from "../BookTableContent.jsx";
import NavButton from "../NavButton.jsx";

// Get specifically the current logged in user's info
const collaboratorsAPIHandler = new APIHandler("collaborators/me");
const loansAPIHandler = new APIHandler("loans");

function LogoutButton() {
  function handleLogout() {
    window.sessionStorage.removeItem("auth_token");
    window.sessionStorage.removeItem("name");
    alert("Vous êtes déconnecté.");
    window.location.assign("/livres");
  }

  return (
    <button onClick={handleLogout} className="navButton" >
      Se déconnecter
    </button>
  );
}

export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [userLoans, setUserLoans] = useState(null);

  useEffect(() => {
    async function getAPI() {
      try {

        // we query the API for loans that belong to the current user & are not returned yet
        const loansBody = await loansAPIHandler.get("?mine=true&returned=false", "");
        
        setUserLoans(loansBody.data);
        const collaboratorBody = await collaboratorsAPIHandler.get("", "");
        setUserInfo(collaboratorBody.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);


  const fixedBooks = userLoans
    ? userLoans.map((loan) => {
        loan.Book.ActiveLoan = loan;
        return loan.Book;
      })
    : null;

  return (
    <>
      <LogoutButton />
      <NavButton Route="/collaborateurs/moi/modifier" Content="Modifier mon profil" />
      <NavButton Route="/collaborateurs/moi/supprimer" Content="Supprimer mon profil" />
      {fixedBooks && userInfo ? (
        <>
          <p className="structuredInfo">
            Bienvenue {userInfo.Name} !

          </p>
          <div className="structuredInfo">
            Vos livres empruntés (cliquez sur un livre pour plus de détails):
            <BookTableContent books={fixedBooks} />
          </div>
        </>
      ) : (
        <p className="loadingBar">Loading...</p>
      )}
    </>
  );
}
