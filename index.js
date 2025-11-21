// dependencies
import morgan from "morgan";
import express from "express";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"

// global middleware
export const app = express();

app.use(cors());
app.options("/*all", cors());
app.use(express.json());
app.use(morgan("dev"));

// routers
app.use("/api/v1/books", booksRouter);

// handle all other routes
app.all("*all", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
