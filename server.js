import { app } from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// global environment vars
dotenv.config({ path: "./config.env" });

// connect to database via mongoose
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("Connected to MongoDB via Mongoose");
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});