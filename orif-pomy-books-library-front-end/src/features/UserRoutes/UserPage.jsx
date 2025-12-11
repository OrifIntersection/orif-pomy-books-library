import APIHandler from "../../utils/APIHandler";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import BookTableContent from "../BookTableContent.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators");

export default function UserPage() {
  const { user } = useContext(AuthContext);
  const [ userInfo, setUserInfo ] = useState(null);

  if (user) collaboratorsAPIHandler.setAuth(user.id);

  useEffect(() => {
    async function getAPI() {
      try {
        if (!user) throw new Error("Vous n'êtes pas login");

        const body = await collaboratorsAPIHandler.get("", user.id);
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
