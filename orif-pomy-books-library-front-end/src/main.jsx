import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import BookTable from "./BookTable.jsx";
import NewBook from "./NewBook.jsx"
import Login from "./Login.jsx";
import MainLayout from "./MainLayout.jsx";
import SingleBook from "./SingleBook.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/books" element={<BookTable />} />
        <Route path="/books/:id" element={<SingleBook />} />
        <Route path="/newbook" element={<NewBook />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
