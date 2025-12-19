
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import "./styles/Forms.css";
import "./styles/BookTable.css";
import "./styles/Navbar.css";
import "./styles/Buttons.css";
import "./styles/LoadingBar.css";
import "./styles/StructuredInfo.css";
import BookTable from "./features/BookTable.jsx";

import BookModifyForm from "./features/BookRoutes/ModifyForm.jsx";
import BookDeleteForm from "./features/BookRoutes/DeleteForm.jsx";
import BookAddForm from "./features/BookRoutes/AddForm.jsx";
import BookGetForm from "./features/BookRoutes/GetForm.jsx";
import BookGetByIdForm from "./features/BookRoutes/GetByIdForm.jsx";

import LoanAddForm from "./features/LoanRoutes/AddForm.jsx";
import LoanDeleteForm from "./features/LoanRoutes/DeleteForm.jsx";

import UserPage from "./features/UserRoutes/UserPage.jsx";
import Login from "./features/UserRoutes/Login.jsx";
import Signup from "./features/UserRoutes/Signup.jsx";
import Navbar from "./features/Navbar.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/livres?" element={<BookGetForm />} />
          <Route path="/livres/:id" element={<BookGetByIdForm />} />
          <Route path="/livres/:id/modifier" element={<BookModifyForm />} />
          <Route path="/livres/:id/emprunter" element={<LoanAddForm />} />
          <Route path="/livres/:id/supprimer" element={<BookDeleteForm />} />
          <Route path="/emprunts/:id/supprimer" element={<LoanDeleteForm />} />
          <Route path="/nouvelle-livre" element={<BookAddForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/collaborateurs/moi" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
);
