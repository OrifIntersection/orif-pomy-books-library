import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import APIHandler from "../../utils/APIHandler";

import useFormSubmit from "../../utils/useFormSubmit";

const collaboratorsAPIHandler = new APIHandler("collaborators/me");

export default function ModifyForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.get();
    },
  });

  const patchForm = useFormSubmit({
    onSubmit: function (values) {
      return collaboratorsAPIHandler.patch(
        {
          name: values.name,
          email: values.email,
        },
        id
      );
    },
    onSuccess: function () {
      setTimeout(() => {
        navigate("/collaborateurs/moi");
      }, import.meta.env.VITE_NAVIGATE_TIMEOUT);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, []);

  if (getForm.error) return <p className="structuredError">{getForm.error}</p>;

  if (getForm.loading) return <p className="loadingBar">Loading...</p>;

  return (
    <>
      {patchForm.error && <p className="structuredError">{patchForm.error}</p>}
      {patchForm.success && (
        <p className="structuredSuccess">{patchForm.success}</p>
      )}
      <p className="structuredInfo">Vous souhaitez modifier votre compte</p>
      <form className="modifyForm" onSubmit={patchForm.handleSubmit}>
        <label htmlFor="name">Nom d'utilisateur: </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={getForm.res?.Name}
        />
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          id="email"
          name="email"
          defaultValue={getForm.res?.Email}
        />
        <input type="submit" value="Modifier" />
      </form>
    </>
  );
}
