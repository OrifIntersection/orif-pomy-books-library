// dependencies
import morgan from "morgan";
import express from "express";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"
import mongoose from "mongoose";
import dotenv from "dotenv";

// global environment vars
dotenv.config({ path: "./config.env" });

// global middleware

const app = express();

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

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    const db = await mongoose.connect(process.env.DATABASE);
    isConnected = db.connections[0].readyState === 1;
  }
}

export default async function appHandler(req, res) {
  await connectDB();
  return app(req, res);
}
