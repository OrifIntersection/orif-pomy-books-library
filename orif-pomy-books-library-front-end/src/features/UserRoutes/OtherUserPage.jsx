import APIHandler from "../../utils/APIHandler";
import { useEffect } from "react";
import { useParams } from "react-router";

import useFormSubmit from "../../utils/useFormSubmit";

const collaboratorsAPIHandler = new APIHandler("collaborators");

export default function OtherUserPage() {
  const { id } = useParams();

  const getForm = useFormSubmit({
    onSubmit: function () {
      return collaboratorsAPIHandler.get("", id);
    },
  });

  useEffect(() => {
    getForm.handleSubmit();
  }, []);

  if (getForm.error) return <p className="structuredError">{getForm.error}</p>;

  if (getForm.loading) return <p className="loadingBar">loading...</p>;

  return (
    <>
      <p className="structuredInfo">Compte de: {getForm.res?.Name}</p>
      <p className="structuredInfo">Email: {getForm.res?.Email}</p>
    </>
  );
}
