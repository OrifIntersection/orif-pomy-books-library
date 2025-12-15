import APIHandler from "../../utils/APIHandler";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {

  //
  //  On successful login, we store the user's name and JWT token in sessionStorage
  //  User name is used for display purposes
  //  JWT token is used handled in APIHandler for authorization via headers
  //

  async function submitLogin(formData) {

    try {
      await collaboratorsAPIHandler.post({ email: formData.get("email") });

      alert("succès!")
      window.location.assign("/livres");  // reload to update navbar
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form action={submitLogin} className="loginForm">
      <label htmlFor="username">Email: </label>
      <input type="text" id="email" name="email" />
      <input type="submit" value="Login" />
    </form>
  );
}
