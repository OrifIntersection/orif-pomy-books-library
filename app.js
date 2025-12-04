// dependencies
import morgan from "morgan";
import express from "express";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"
import dotenv from "dotenv";
import mongoose from "mongoose";

// global environment vars
dotenv.config({ path: "./config.env" });

// global middleware
const app = express();

app.use(cors());
app.options("/*all", cors());
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

// routers
app.use("/api/v1/books", booksRouter);

// handle all other routes
app.all("*all", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  console.error(err);

  if (err.isOperational) res.status(statusCode).json({
    status,
    message,
  });


  res.status(statusCode).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
})

// connect to database via mongoose
let dbConnected = false;
if (dbConnected === false) {
  mongoose.connect(process.env.DATABASE, { dbName: "Library_ORIF_Pomy" }).then(() => {
    console.log("Connected to MongoDB via Mongoose");
    dbConnected = true;
  });
}



// start server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
