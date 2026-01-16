import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import useFormSubmit from "../../utils/useFormSubmit";
import APIHandler from "../../utils/APIHandler";

const collaboratorsAPIHandler = new APIHandler("collaborators/auth");

export default function AuthForm() {
  const { auth } = useParams();
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.get("", auth);
    },
    onSuccess: function () {
      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, []);

  if (getForm.error) return <p className="structuredError">{getForm.error}</p>;
  if (getForm.success)
    return <p className="structuredSuccess">{getForm.success}</p>;
  if (getForm.loading) return <p className="loadingBar">Authentification...</p>;
}
