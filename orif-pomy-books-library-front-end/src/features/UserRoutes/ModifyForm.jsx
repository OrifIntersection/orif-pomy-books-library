import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";
import { UsernameContext } from "../../contexts/UsernameContext";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function ModifyForm() {
  const [collaborator, setCollaborator] = useState();

  const [error, setError] = useState({ get: null, patch: null });
  const [success, setSuccess] = useState();
  const { id } = useParams();

  const navigate = useNavigate();

  const { setUsername } = useContext(UsernameContext);

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await collaboratorsAPIHandler.get();
        setCollaborator(body.data);
      } catch (error) {
        console.error(error);
        setError((prev) => ({ ...prev, get: error.message }));
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const body = await collaboratorsAPIHandler.patch(
        { name: formData.get("name"), email: formData.get("email") },
        id
      );

      setSuccess(body.message);
      setUsername(localStorage.getItem("username"));

      setTimeout(() => {
        navigate("/collaborateurs/moi");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    } catch (error) {
      console.error(error);
      setError((prev) => ({ ...prev, patch: error.message }));
    }
  }

  if (error.get) return <p className="structuredError">{error.get}</p>;

  return collaborator ? (
    <>
      {error.patch && <p className="structuredError">{error.patch}</p>}
      {success && <p className="structuredSuccess">{success}</p>}
      <p className="structuredInfo">Vous souhaitez modifier votre compte</p>
      <form className="modifyForm" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom d'utilisateur: </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={collaborator.Name}
        />
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          id="email"
          name="email"
          defaultValue={collaborator.Email}
        />
        <input type="submit" value="Modifier" />
      </form>
    </>
  ) : (
    <p className="loadingBar">Loading...</p>
  );
}
