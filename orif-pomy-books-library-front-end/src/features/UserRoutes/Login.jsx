import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const collaboratorsAPIHandler = new APIHandler("collaborators/login");

export default function Login() {

  //
  //  On successful login, we store the user ID, name, and JWT token in sessionStorage
  //  User name is used for display purposes
  //  User ID is used to check active loans and modifications
  //

  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);
  async function submitLogin(formData) {

    try {
      const body = await collaboratorsAPIHandler.post({
        email: formData.get("email"),
      });
      setUser(body.data);

      window.sessionStorage.setItem("user", `${body.data.id}`);
      window.sessionStorage.setItem("name", `${body.data.name}`);

      alert("succès!")
      navigate("/livres");
      window.location.reload();
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
