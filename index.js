// dependencies
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import mongoConnect from "./dev-data/config/mongoConnect.js";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"
import fs from "fs";
import path from "path";

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
const booksPath = path.join(process.cwd(), "dev-data", "data", "books.json");
const booksData = fs.readFileSync(booksPath, "utf-8");
const books = JSON.parse(booksData);


app.use((req, res, next) => {
  if (books) {
    req.body = books;
    return next();
  } else {

    req.body = [{
      "_id": "abcde",
      "Title": "Test for API Calling",
      "Author": ["John Smith", "Jane Doe"],
      "Genre": ["How to use APIs", "API Testing"],
      "Subject": ["Learning APIs", "Software Testing"],
      "Location": "This is a test location",
      "ISBN": "2-89565-089-6",
      "Loans": [{ "_id": "12345" }, { "_id": "12346" }]
    },
    {
      "Genre": ["Techniques d'encadrement"],
      "Title": "A chacun sa façon d'apprendre",
      "Author": ["Mel LEVINE", "M.D."],
      "Subject": ["Apprentissage et épanouissement personnel"],
      "Location": "Bureau KOIR",
      "ISBN": "2-89565-089-6",
      "Loans": []
    }];
    return next();
  }

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
