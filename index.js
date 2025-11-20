// dependencies
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import mongoConnect from "./dev-data/config/mongoConnect.js";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"

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

let client;

try {
  client = await mongoConnect(process.env.DATABASE);
} catch (err) {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); // or throw err
}

export { client };

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
