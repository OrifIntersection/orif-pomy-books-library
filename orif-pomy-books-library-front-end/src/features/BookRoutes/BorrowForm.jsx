import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function ModifyBook() {
  const [book, setBook] = useState({});
  const { id } = useParams();

  //
  // useEffect to getBookById from the API
  // runs once on page load to query for getBookById
  //

  useEffect(() => {
    async function getAPI() {
      try {
        const res = await fetch(
          `https://orif-pomy-books-library.vercel.app/api/v1/books/${id}`
        );
        if (res.ok) {
          const resBook = await res.json();
          setBook(resBook);
        } else {
          alert("Une erreur est survenue sur le serveur");
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAPI();
  }, []);
}
