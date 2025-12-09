import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import "./styles/Forms.css";
import "./styles/BookTable.css";
import "./styles/Navbar.css";
import BookTable from "./features/BookTable.jsx";

import BookModifyForm from "./features/BookRoutes/ModifyForm.jsx";
import BookDeleteForm from "./features/BookRoutes/DeleteForm.jsx";
import BookAddForm from "./features/BookRoutes/AddForm.jsx";

import LoanAddForm from "./features/LoanRoutes/AddForm.jsx";

import UserPage from "./features/UserRoutes/UserPage.jsx";
import Login from "./features/UserRoutes/Login.jsx";
import Navbar from "./features/Navbar.jsx";
import AuthProvider from "./utils/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/livres?" element={<BookTable />} />
          <Route path="/livres/:id" element={<BookTable />} />
          <Route path="/livres/:id/modifier" element={<BookModifyForm />} />
          <Route path="/livres/:id/emprunter" element={<LoanAddForm />} />
          <Route path="/livres/:id/supprimer" element={<BookDeleteForm />} />
          <Route path="/nouvelle-livre" element={<BookAddForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collaborateurs/moi" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
