// dependencies
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoConnect from "./dev-data/config/mongoConnect.js";


// global environment vars
dotenv.config({ path: "./config.env" });

// call the run function to connect to the database
mongoConnect(process.env.DATABASE).catch(console.dir);


// start server
const app = express();
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

// global middleware
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// routers
import booksRouter from "./dev-data/routes/booksRoute.js"
app.use("/api/v1/books", booksRouter);

// handle all other routes
app.get("/public/main.js", (req, res) => {
  res.status(200).sendFile("public/main.js", { root: "." });
});

app.all("*all", (req, res) => {
  res.status(200).sendFile("public/index.html", { root: "." });
});

