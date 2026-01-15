import { useNavigate } from "react-router";
import { useContext } from "react";

import { UsernameContext } from "../../contexts/UsernameContext";

export default function LogoutButton() {
  // this logout could be handled server-side via a collaborators/me/logout endpoint
  // the server would simply need to send a deauth: true on the response
  // but this logic works just fine for now.

  const navigate = useNavigate();
  const { setUsername } = useContext(UsernameContext);

  function handleLogout() {
    window.localStorage.removeItem("Auth-Token");
    window.localStorage.removeItem("username");
    setUsername(null);
    alert("Vous êtes déconnecté.");

    navigate("/livres");
  }

  return (
    <button onClick={handleLogout} className="navButton">
      Se déconnecter
    </button>
  );
}
