import { useState, useEffect } from "react";


export default function Login() {
  async function submitLogin(formData) {
    try {
      const res = await fetch(
        "https://orif-pomy-books-library.vercel.app/api/v1/collaborators",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.get("user"),
            password: formData.get("pass"),
          }),
        }
      );
    } catch (error) {}
  }

  return (
      <form action={submitLogin} className="loginForm">
        <label htmlFor="username">Utilisateur: </label>
        <input type="text" id="username" name="user" />
        <label htmlFor="password">Mot de passe: </label>
        <input type="password" id="password" name="pass" />
        <input type="submit" value="Login" />
      </form>

  );
}
