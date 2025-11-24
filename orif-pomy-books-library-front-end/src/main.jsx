import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import BookTable from "./BookTable.jsx";
import NewBook from "./NewBook.jsx"
import Login from "./Login.jsx";
import Navbar from "./Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Navbar />}>
        <Route path="/books?" element={<BookTable />} />
        <Route path="/books/:id" element={<BookTable />} />
        <Route path="/newbook" element={<NewBook />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
