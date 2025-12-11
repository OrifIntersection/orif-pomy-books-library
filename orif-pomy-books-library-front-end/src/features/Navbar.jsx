import { Outlet, Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

function Navbar() {
  const user = window.sessionStorage.getItem("name");

  console.log("Navbar user:", user);

  return (
    <>
      <header className="navbar">
        <p>
          Orif Pomy Bibliothèque
          <Link to="/livres" className="link">
            Livres
          </Link>
          <Link to="/nouvelle-livre" className="link">
            + Ajouter un livre
          </Link>
          {user ? (
            <Link to="/collaborateurs/moi" className="login">
              {user}
            </Link>
          ) : (
            <Link to="/login" className="login">
              Login
            </Link>
          )}
        </p>
      </header>
      <Outlet />
    </>
  );
}

export default Navbar;
