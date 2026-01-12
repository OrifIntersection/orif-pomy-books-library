import APIHandler from "../../utils/APIHandler";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

const collaboratorsAPIHandler = new APIHandler("collaborators");

export default function OtherUserPage() {
  const [collaborator, setCollaborator] = useState();
  const [error, setError] = useState();
  const { id } = useParams();

  useEffect(() => {
    async function GetAPI() {
      try {
        const body = await collaboratorsAPIHandler.get("", id);
        setCollaborator(body.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }

    GetAPI();
  }, []);

  if (error) return <p className="structuredError">{error}</p>;

  return collaborator ? (
    <>
      <p className="structuredInfo">Compte de: {collaborator.Name}</p>
      <p className="structuredInfo">Email: {collaborator.Email}</p>
    </>
  ) : (
    <p className="loadingBar">loading...</p>
  );
}
