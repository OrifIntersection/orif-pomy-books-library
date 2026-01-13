import APIHandler from "../../utils/APIHandler";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UsernameContext } from "../../contexts/UsernameContext";

const collaboratorsAPIHandler = new APIHandler("collaborators/signup");

export default function Signup() {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const navigate = useNavigate();

  const { setUsername } = useContext(UsernameContext);

  async function handleSubmit(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const name = e.target.name.value;

    try {
      const body = await collaboratorsAPIHandler.post({ name, email });

      setSuccess(body.message);
      setUsername(localStorage.getItem("username"));

      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signupForm">
      {error && <p className="structuredError">{error}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
      <label htmlFor="name">Nom d'utilisateur: </label>
      <input type="text" id="name" name="name" />
      <label htmlFor="email">Email: </label>
      <input type="text" id="email" name="email" />

      <input type="submit" value="Créer mon compte" />
    </form>
  );
}
