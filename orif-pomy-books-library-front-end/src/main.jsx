import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import "./styles/Forms.css";
import "./styles/BookTable.css";
import "./styles/Navbar.css";
import BookTable from "./features/BookTable.jsx";
import ModifyBook from "./features/BookRoutes/ModifyForm.jsx";
import DeleteBook from "./features/BookRoutes/DeleteForm.jsx";
import NewBook from "./features/BookRoutes/AddForm.jsx";
import BorrowBook from "./features/BookRoutes/BorrowForm.jsx";
import Login from "./features/UserRoutes/Login.jsx";
import Navbar from "./features/Navbar.jsx";
import AuthProvider from "./utils/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/books?" element={<BookTable />} />
          <Route path="/books/:id" element={<BookTable />} />
          <Route path="/books/:id/modify" element={<ModifyBook />} />
          <Route path="/books/:id/borrow" element={<BookTable />} />
          <Route path="/books/:id/delete" element={<DeleteBook />} />
          <Route path="/newbook" element={<NewBook />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
