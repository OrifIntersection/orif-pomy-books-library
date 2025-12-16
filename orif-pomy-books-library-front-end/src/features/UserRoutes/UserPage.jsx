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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    async function getAPI() {
      try {
        setSearchParams("?mine=true&returned=false")
        
        const loansBody = await loansAPIHandler.get(searchParams, "");
        setUserLoans(loansBody.data);
        const collaboratorBody = await collaboratorsAPIHandler.get("", "");
        setUserInfo(collaboratorBody.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);


  return (
    <>
      <LogoutButton />
      <NavButton Route="/collaborateurs/moi/modifier" Content="Modifier mon profil" />
      <NavButton Route="/collaborateurs/moi/supprimer" Content="Supprimer mon profil" />
      {userLoans && userInfo ? (
        <>
          <p className="structuredInfo">
            Bienvenue {userInfo.Name} !

          </p>
          <div className="structuredInfo">
            Vos livres empruntés (cliquez sur un livre pour plus de détails):
            <BookTableContent books={userLoans.map(loan => loan.Book)} />
          </div>
        </>
      ) : (
        <p className="loadingBar">Loading...</p>
      )}
    </>
  );
}
