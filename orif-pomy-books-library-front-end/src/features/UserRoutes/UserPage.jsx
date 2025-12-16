import APIHandler from "../../utils/APIHandler";
import { useEffect, useState } from "react";
import BookTableContent from "../BookTableContent.jsx";



// Get specifically the current logged in user's info
const collaboratorsAPIHandler = new APIHandler("collaborators/me");

function LogoutButton() {

  function handleLogout() {
    window.sessionStorage.removeItem("auth_token");
    window.sessionStorage.removeItem("name");
    alert("Vous êtes déconnecté.");
    window.location.assign("/livres");
  }

  return <button onClick={handleLogout} className="navButton">Se déconnecter</button>
}

export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await collaboratorsAPIHandler.get("", "");
        setUserInfo(body.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);

  //
  // BookTableContent expects an array of books
  // Each book can have an ActiveLoan property, which is not populated by the API in this context
  // So we manually add them here
  //

  let loanedBooks = null;

  if (userInfo) {
    loanedBooks = userInfo.activeLoans.map((loan) => {
      loan.Book.ActiveLoan = loan
      return loan.Book;
      })
  }


  return (
    <>
      <LogoutButton />
      {loanedBooks ? (
        <div className="structuredInfo">
          Vos livres empruntés (cliquez sur un livre pour plus de détails):
          <BookTableContent books={loanedBooks} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
