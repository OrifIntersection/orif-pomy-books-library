import { Outlet, Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <header className="navbar">
        <p>
          Orif Pomy Bibliothèque
          <Link to="/books" className="link">
            Livres
          </Link>
          <Link to="/newbook" className="link">
            + Ajouter un livre
          </Link>
          <Link to="/login" className="login">
            Login
          </Link>
        </p>
      </header>
      <Outlet />
    </>
  );
}

export default Navbar;
