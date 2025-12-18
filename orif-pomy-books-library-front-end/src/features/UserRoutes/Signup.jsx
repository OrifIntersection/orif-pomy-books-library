import APIHandler from "../../utils/APIHandler";
import { useState } from "react";

const collaboratorsAPIHandler = new APIHandler("collaborators/signup");

export default function Signup() {
    const [postError, setPostError] = useState();
    
      async function handleSubmit(e) {
        e.preventDefault();

        const email = e.target.email.value;
        const name = e.target.name.value

        try {
          await collaboratorsAPIHandler.post({ name, email });
          alert("Votre compte à été créé avec succès!")
          window.location.assign("/livres");  // reload to update navbar
        } catch (error) {
          console.error(error);
          setPostError(error.message);
        }
      }

    return (
    <form onSubmit={handleSubmit} className="signupForm">
      {postError ? <p className="structuredError">{postError}</p> : null}
      <label htmlFor="email">Email: </label>
      <input type="text" id="email" name="email" />
        <label htmlFor="name">Nom d'utilisateur: </label>
      <input type="text" id="name" name="name" />
      <input type="submit" value="Créer mon compte" />
    </form>
  );
}