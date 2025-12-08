// dependencies
import express from "express";
import cors from "cors";
import booksRouter from "./dev-data/routes/booksRoute.js"
import collaboratorsRouter from "./dev-data/routes/collaboratorsRoute.js"
import loansRouter from "./dev-data/routes/loansRoute.js"
// import dotenv from "dotenv";
import mongoose from "mongoose";
import AppError from "./dev-data/utils/AppError.js";

// global environment vars
// dotenv.config({ path: "./config.env" });

// global middleware
const app = express();

app.use(cors({ origin: "https://ideal-trout-5g7x9xxvxg462p-5173.app.github.dev" }));
app.use(express.json());

// routers
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/collaborators", collaboratorsRouter);
app.use("/api/v1/loans", loansRouter)

// handle all other routes
app.all("*all", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// global error handling middleware

app.use((err, req, res, next) => {

  //
  // use to handle mongoose/express operational errors before reaching the final error handler
  //

  if (err.name === "CastError") return next(new AppError(`${err.value} is not what ${err.path} expects as a value: ${err.kind}`, 400));
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(el => el.message);
    return next(new AppError(`Invalid input data. ${messages.join(". ")}`, 400));
  }

  next(err);

})

app.use((err, req, res, next) => { 

  //
  // final error handling middleware
  //

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

//
// connect to database via mongoose
// need to fix so it doesn't connect on every request
//
await mongoose.connect(process.env.DATABASE, { dbName: "Library_ORIF_Pomy" }).then(() => {
    console.log("Connected to MongoDB via Mongoose");
});




// start server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
