import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router";
import "./Navbar.css";

function Navbar() {
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
