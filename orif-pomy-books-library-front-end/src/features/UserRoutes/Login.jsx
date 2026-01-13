import APIHandler from "../../utils/APIHandler";
import { useState, useContext } from "react";
import NavButton from "../NavButton.jsx";
import { useNavigate } from "react-router";
import { UsernameContext } from "../../contexts/UsernameContext.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {
  //
  //  On successful login, the API handler will automatically sore the JWT & user name in sessionStorage
  //  User name is used for display purposes
  //  JWT token is used handled in APIHandler for authorization via headers
  //

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const navigate = useNavigate();

  const { setUsername } = useContext(UsernameContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const body = await collaboratorsAPIHandler.post({ email });

      setSuccess(body.message);
      setUsername(body.auth.name);

      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      {error && <p className="structuredError">{error}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
      <label htmlFor="username">Email: </label>
      <input type="text" id="email" name="email" />
      <input type="submit" value="Login" />
      <NavButton
        Route="/signup"
        Content="Créez un compte"
        ClassName="signupButton"
      />
    </form>
  );
}
