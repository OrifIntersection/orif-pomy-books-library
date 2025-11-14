// dependencies
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import mongoConnect from "./dev-data/config/mongoConnect.js";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"
import fs from "fs";

// global environment vars
dotenv.config({ path: "./config.env" });


// global middleware
const app = express();

app.use(cors());
app.options("/*all", cors());
app.use((req, res, next) => {
  console.log("received request");
  next();
});
app.use(express.json());
app.use(morgan("dev"));

// get all books data
// const booksData = fs.readFileSync("./dev-data/data/books.json", "utf-8");
// const books = JSON.parse(booksData);


app.use((req, res, next) => {
  req.body = { books: "This is sample book data from middleware" };
  next();
});


// routers
app.use("/api/v1/books", booksRouter);

// call the connect function to connect to the database
mongoConnect(process.env.DATABASE).catch(console.dir);

// start server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

// handle all other routes
app.all("*all", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
