import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");

export default function DeleteForm() {
  const [book, setBook] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

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
    }
  }

  return Object.keys(book).length === 0 ? (
    <p className="structuredInfo">Ce livre n'existe pas ou plus !</p>
  ) : (
    <form className="deleteForm" onSubmit={deleteBook}>
      <p className="structuredInfo">
        Êtes vous sûr de vouloir supprimer "{book.Title}" ?
      </p>
      <input type="submit" value="Supprimer Définitivement"  style={{ color: "red", fontWeight: "bold" }}/>
    </form>
  );
}
