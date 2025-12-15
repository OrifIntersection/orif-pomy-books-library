import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {

  //
  //  On successful login, we store the user ID, name, and JWT token in sessionStorage
  //  User name is used for display purposes
  //  User ID is used to check active loans and modifications
  //

  const navigate = useNavigate();

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
