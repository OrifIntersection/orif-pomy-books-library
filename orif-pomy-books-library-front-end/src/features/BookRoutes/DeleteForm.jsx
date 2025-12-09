import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";
import { AuthContext } from "../../contexts/AuthContext";

const booksAPIHandler = new APIHandler("books");

export default function DeleteForm() {
  const [book, setBook] = useState({});
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  if (user) booksAPIHandler.setAuth(user.id)

  //
  // useEffect to getBookById from the API
  // runs once on page load to query for getBookById
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await booksAPIHandler.get("", id);
        setBook(body.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAPI();
  }, []);

  //
  // function to delete the book at the given ID
  //

  async function deleteBook(e) {
    e.preventDefault();

    try {
      await booksAPIHandler.delete(id);
      alert("le livre à été supprimé");
      navigate("/livres");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la suppression du livre");
    }
  }

  if (Object.keys(book).length === 0) {
    return (
      <form className="deleteForm">
        <p>Ce livre n'existe pas ou plus !</p>
      </form>
    );
  }

  return (
    <form className="deleteForm" onSubmit={deleteBook}>
      <p>
        Êtes vous sûr de vouloir supprimer "{book.Title}" ?
        <br />
        Les données ne pourront pas être recupérées.
      </p>
      <input type="submit" value="Supprimer Définitivement" />
    </form>
  );
}
