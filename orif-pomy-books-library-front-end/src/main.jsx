import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import "./Forms.css";
import BookTable from "./BookTable.jsx";
import ModifyBook from "./BookRoutes/ModifyBook.jsx";
import DeleteBook from "./BookRoutes/DeleteBook.jsx";
import NewBook from "./BookRoutes/NewBook.jsx";
import BorrowBook from "./BookRoutes/BorrowBook.jsx";
import Login from "./UserRoutes/Login.jsx";
import Navbar from "./Navbar.jsx";

createRoot(document.getElementById("root")).render(
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
);
