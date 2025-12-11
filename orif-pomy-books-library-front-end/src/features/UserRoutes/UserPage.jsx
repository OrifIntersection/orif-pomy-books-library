import APIHandler from "../../utils/APIHandler";
import { useContext, useEffect, useState } from "react";
import BookTableContent from "../BookTableContent.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators");

export default function UserPage() {
  const [ userInfo, setUserInfo ] = useState(null);

  const user = window.sessionStorage.getItem("user");


  useEffect(() => {
    async function getAPI() {
      try {
        if (!user) throw new Error("No user logged in");

        const body = await collaboratorsAPIHandler.get("", user);
        setUserInfo(body.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);

  const loanedBooks = userInfo ? userInfo.activeLoans.map(loan => loan.Book) : [];

  return userInfo ? (
  <div>
    Vos livres empruntés :
    <BookTableContent books={loanedBooks} />
  </div>
  ) : (
    <p>Loading...</p>
  );
}
