import { useState, useEffect } from "react";
import { Link } from "react-router";
import "./Navbar.css";

function Navbar() {
  return (
    <header>
      <p>
        Orif Pomy Bibliothèque
        <Link to="/books" className="link">Livres</Link>
        <Link to="/newbook" className="link">+ Ajouter une livre</Link>
        <Link to="/login" className="login">Login</Link>
      </p>
    </header>
  );
}

export default Navbar;
