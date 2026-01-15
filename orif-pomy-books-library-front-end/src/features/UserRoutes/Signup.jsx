import APIHandler from "../../utils/APIHandler";
import { useNavigate } from "react-router";

import useFormSubmit from "../../utils/useFormSubmit";

const collaboratorsAPIHandler = new APIHandler("collaborators/signup");

export default function Signup() {
  const navigate = useNavigate();

  const postForm = useFormSubmit({
    onSubmit: function (values) {
      return collaboratorsAPIHandler.post({
        name: values.name,
        email: values.email,
      });
    },
    onSuccess: function () {
      setTimeout(() => {
        navigate("/livres");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  if (postForm.success)
    return <p className="structuredSuccess">{postForm.success}</p>;

  return (
    <form onSubmit={postForm.handleSubmit} className="signupForm">
      {postForm.error && <p className="structuredError">{postForm.error}</p>}
      <label htmlFor="name">Nom d'utilisateur: </label>
      <input type="text" id="name" name="name" />
      <label htmlFor="email">Email: </label>
      <input type="text" id="email" name="email" />

      <input type="submit" value="Créer mon compte" />
    </form>
  );
}
