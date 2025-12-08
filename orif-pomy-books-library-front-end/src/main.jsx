import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import "./styles/Forms.css";
import "./styles/BookTable.css";
import "./styles/Navbar.css";
import BookTable from "./features/BookTable.jsx";
import ModifyForm from "./features/BookRoutes/ModifyForm.jsx";
import DeleteForm from "./features/BookRoutes/DeleteForm.jsx";
import AddForm from "./features/BookRoutes/AddForm.jsx";
import BorrowBook from "./features/BookRoutes/BorrowForm.jsx";
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
          <Route path="/livres/:id/modifier" element={<ModifyForm />} />
          <Route path="/livres/:id/emprunter" element={<BookTable />} />
          <Route path="/livres/:id/supprimer" element={<DeleteForm />} />
          <Route path="/nouvelle-livre" element={<AddForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collaborateurs/moi" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
