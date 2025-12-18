import APIHandler from "../../utils/APIHandler";
import { useState } from "react";
import NavButton from "../NavButton.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {
  //
  //  On successful login, we store the user's name and JWT token in sessionStorage
  //  User name is used for display purposes
  //  JWT token is used handled in APIHandler for authorization via headers
  //

  const [postError, setPostError] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await collaboratorsAPIHandler.post({ email });
      alert("succès!");
      window.location.assign("/livres"); // reload to update navbar
    } catch (error) {
      console.error(error);
      setPostError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      {postError ? <p className="structuredError">{postError}</p> : null}
      <label htmlFor="username">Email: </label>
      <input type="text" id="email" name="email" />
      <input type="submit" value="Login" />
      <NavButton Route="/signup" Content="Créez un compte" ClassName="signupButton" />
    </form>
  );
}
