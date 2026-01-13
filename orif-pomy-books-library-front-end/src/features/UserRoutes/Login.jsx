import APIHandler from "../../utils/APIHandler";
import NavButton from "../NavButton.jsx";
import { useNavigate } from "react-router";

import useFormSubmit from "../../utils/useFormSubmit.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {
  //
  //  On successful login, the API handler will automatically sore the JWT & user name in sessionStorage
  //  User name is used for display purposes
  //  JWT token is used handled in APIHandler for authorization via headers
  //

  const navigate = useNavigate();

  const { handleSubmit, success, error, loading } = useFormSubmit({
    onSubmit: function (values) {
      return collaboratorsAPIHandler.post({ email: values.email });
    },
    onSuccess: function () {
      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

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
