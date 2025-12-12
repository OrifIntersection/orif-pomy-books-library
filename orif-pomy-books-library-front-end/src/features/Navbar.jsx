import { Outlet, Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import NavButton from "./NavButton.jsx";

function Navbar() {
  const user = window.sessionStorage.getItem("name");

  console.log("Navbar user:", user);

  return (
    <>
      <header className="navbar">
        <p>
          Orif Pomy Bibliothèque
          <NavButton Route="/livres" Content="Accueil" ClassName="navBarButton" />
          <NavButton Route="/nouvelle-livre" Content="+ Ajouter un livre" ClassName="navBarButton" />
          {user ? (
            <NavButton Route="/collaborateurs/moi" Content={user} ClassName="loginButton"/>
          ) : (
            <NavButton Route="/login" Content="Login" ClassName="loginButton" />
          )}
        </p>
      </header>
      <Outlet />
    </>
  );
}

export default Navbar;
