//
//  A custom hook that will handle form submissions
//  handleSubmit receives the form onSubmit event, and extracts the FormData object from it
//  onSubmit is a callback function -> it is called with the entries parsed from the FormData object.
//  notably, onSubmit expects the return value from the API handler.

//  onSuccess is a callback function that will run if the API is queried successfully -> it is called with the response body
//  onError is a callback function that will run if the API returns an error -> it is called with the error body
//

//
//  the hook returns the handleSubmit function itself,
//  loading is a boolean value that is set to false once the response has been handled
//  success is a string value equal to the res.message returned by the server => default null
//  error is a string value equal to the err.message returned by the server => default null
//

import { useState, useContext } from "react";
import { UsernameContext } from "../contexts/UsernameContext";

export default function useFormSubmit({ onSubmit, onSuccess, onError }) {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { setUsername } = useContext(UsernameContext);

  async function handleSubmit(e) {
    e?.preventDefault();
    setLoading(true);
    setError(null); // reset the error state when a new form is submitted

    try {
      let formData;
      let values;

      if (e) {
        formData = new FormData(e.target);
        values = Object.fromEntries(formData.entries());
      }

      const res = await onSubmit(values);

      // session storage management only runs when res contains an auth field
      // we need the name to display on Navbar

      if (res.auth) {
        localStorage.setItem("Auth-Token", res.auth.authToken);
        localStorage.setItem("username", res.auth.name); // if it is just state, it will be deleted
        setUsername(res.auth.name);
      }

      if (res.deauth) {
        localStorage.removeItem("Auth-Token");
        localStorate.removeItem("username");
        setUsername(null);
      }

      setSuccess(res?.message ?? "Succès"); // if no message is returned by the server, default to 'succès'
      setRes(res.data);
      onSuccess?.(res);
    } catch (err) {
      // all errors should already be handled by the APIHandler, but just in case
      setError(
        err.message || "Une erreur inattendue est survenue sur le serveur."
      );
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, loading, success, error, res };
}
