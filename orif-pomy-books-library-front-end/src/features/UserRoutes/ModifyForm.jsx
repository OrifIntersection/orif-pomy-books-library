import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function ModifyForm() {
  const [collaborator, setCollaborator] = useState();
  const [getError, setGetError] = useState();
  const [patchError, setPatchError] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAPI() {
      try {
        const body = await collaboratorsAPIHandler.get();
        setCollaborator(body.data);
      } catch (error) {
        console.error(error);
        setGetError(error.message);
      }
    }
    getAPI();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      await collaboratorsAPIHandler.patch(
        { name: formData.get("name"), email: formData.get("email") },
        id
      );
      alert("Votre compte à été modifié avec succès !");

      navigate(`/collaborateurs/moi`);
    } catch (error) {
      console.error(error);
      setPatchError(error.message);
    }
  }

  if (getError) return <p className="structuredError">{getError}</p>;

  return collaborator ? (
    <>
      {patchError && <p className="structuredError">{patchError}</p>}
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
