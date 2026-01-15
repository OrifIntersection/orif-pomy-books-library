// dependencies
import express from "express";
import booksRouter from "./api/routes/booksRoute.js";
import collaboratorsRouter from "./api/routes/collaboratorsRoute.js";
import loansRouter from "./api/routes/loansRoute.js";
import mongoose from "mongoose";
import AppError from "./api/utils/AppError.js";
import dotenv from "dotenv";

import nodemailer from "nodemailer";

// import global environment variables
dotenv.config({ path: "./config.env" });

// global middleware
const app = express();

app.use(express.json());
app.use(
  express.static("orif-pomy-books-library-front-end/dist", { redirect: true })
);

// routers
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/collaborators", collaboratorsRouter);
app.use("/api/v1/loans", loansRouter);

// handle all other routes, redirect to -> /dist/index.html
app.all("*all", (req, res) => {
  res.sendFile(
    "/srv/orif-pomy-books-library/orif-pomy-books-library-front-end/dist/index.html"
  );
});

// global error handling middleware
app.use((err, req, res, next) => {
  //
  // use to handle mongoose/express operational errors before reaching the final error handler
  //

  if (err.name === "CastError") return next(new AppError("MALFORMED_ID"));

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((el) => el.message);
    return next(
      new AppError(`Invalid input data. ${messages.join(". ")}`, 400)
    );
  }

  if (err.name === "TokenExpiredError")
    return next(new AppError("EXPIRED_AUTH"));

  next(err);
});

app.use((err, req, res, next) => {
  //
  // final error handling middleware
  //

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Internal Server Error";

  console.error(err);

  if (err.isOperational)
    return res.status(statusCode).json({
      status,
      message,
    });

  res.status(statusCode).json({
    status: "error",
    message: "Something went very wrong!",
  });
});

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

(async () => {
  try {
    const info = await transporter.sendMail({
      from: "testing@bibliotheque.applications.ws", // sender address
      to: ["lithiumium@gmail.com"], // list of recipients
      subject: "Hello", // subject line
      html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail", err);
  }
})();

//
// connect to database via mongoose
// need to fix so it doesn't connect on every request
//
await mongoose
  .connect(process.env.DATABASE, { dbName: "Library_ORIF_Pomy" })
  .then(() => {
    console.log("Connected to MongoDB via Mongoose");
  });

// start server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
