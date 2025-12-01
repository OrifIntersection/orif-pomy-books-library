import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../utils/APIHandler";

const booksAPIHandler = new APIHandler("books");

export default function ModifyBook() {
  const [book, setBook] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  //
  // useEffect to getBookById from the API
  // runs once on page load to query for getBookById
  //

  useEffect(() => {
    async function getAPI() {
      const body = await booksAPIHandler.get("", id)
      setBook(body.data);
    }
    getAPI();
  }, []);

  //
  // function to delete the book at the given ID
  //

  async function deleteBook(e) {
    e.preventDefault();
    await booksAPIHandler.delete(id) 
    alert('le livre à été supprimé')
    navigate("/books");
  }

  if (Object.keys(book).length === 0) {
    return (
      <form className="deleteForm">
        <p>Ce livre n'existe pas/plus</p>
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
