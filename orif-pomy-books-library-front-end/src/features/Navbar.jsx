import { Outlet } from "react-router";
import NavButton from "./NavButton.jsx";
import { useUsername } from "../contexts/UsernameContext.jsx";

function Navbar() {
  const { username } = useUsername();

  return (
    <>
      <header className="navbar">
        <p>
          Orif Pomy Bibliothèque
          <NavButton
            Route="/livres"
            Content="Accueil"
            ClassName="navBarButton"
          />
          <NavButton
            Route="/nouvelle-livre"
            Content="+ Ajouter un livre"
            ClassName="navBarButton"
          />
          {username ? (
            <NavButton
              Route="/collaborateurs/moi"
              Content={username}
              ClassName="loginButton"
            />
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
