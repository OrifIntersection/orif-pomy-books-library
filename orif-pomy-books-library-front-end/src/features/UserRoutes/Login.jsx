import APIHandler from "../../utils/APIHandler";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const collaboratorHandler = new APIHandler("collaborators/login");

export default function Login() {
  const { user, setUser } = useContext(AuthContext);
  async function submitLogin(formData) {


    try {
      const body = await collaboratorHandler.post({ email: formData.get("email") });
      console.log(body)
      setUser(body.data);
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
