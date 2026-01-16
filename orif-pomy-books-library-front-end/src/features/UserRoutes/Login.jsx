import APIHandler from "../../utils/APIHandler";
import NavButton from "../NavButton.jsx";

import useFormSubmit from "../../utils/useFormSubmit.jsx";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {
  //
  //  On successful login, the API handler will automatically sore the JWT & user name in sessionStorage
  //  User name is used for display purposes
  //  JWT token is used handled in APIHandler for authorization via headers
  //

  const postForm = useFormSubmit({
    onSubmit: function (values) {
      return collaboratorsAPIHandler.post({ email: values.email });
    },
  });

  if (postForm.success)
    return <p className="structuredSuccess">{postForm.success}</p>;

  return (
    <form onSubmit={postForm.handleSubmit} className="loginForm">
      {postForm.error && <p className="structuredError">{postForm.error}</p>}
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
