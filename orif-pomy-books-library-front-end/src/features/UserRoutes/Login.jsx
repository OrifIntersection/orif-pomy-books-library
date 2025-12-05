import APIHandler from "../../utils/APIHandler";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const collaboratorHandler = new APIHandler("collaborators");

export default function Login() {
  async function submitLogin(formData) {
    const { user, setUser } = useContext(AuthContext);

    try {
      const res = await collaboratorHandler.post({ email: formData.get("email") });
      const body = await res.json();
      setUser(body.data);

      console.log(user);

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
