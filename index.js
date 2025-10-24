// dependencies
const fs = require("fs");
const morgan = require("morgan");
const express = require("express");

// global variables
const app = express();
const port = 3000;

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// global middleware
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// routers
const booksRouter = require("./dev-data/routes/booksRoute.js");
const e = require("express");
app.use("/api/v1/books", booksRouter);

// handle all other routes
app.get("/public/main.js", (req, res) => {
  res.status(200).sendFile("public/main.js", { root: "." });
});

app.all("*all", (req, res) => {
  res.status(200).sendFile("public/index.html", { root: "." });
});

// temp code to clean temp.json
const tempData = fs.readFileSync("dev-data/data/temp.json", "utf-8");
const temp = JSON.parse(tempData);
temp.forEach(element => {
  Object.defineProperty(element, 'Title',  Object.getOwnPropertyDescriptor(element, 'Titre'));
  Object.defineProperty(element, 'Author',  Object.getOwnPropertyDescriptor(element, 'Auteur·ice'));
  Object.defineProperty(element, 'Subject',  Object.getOwnPropertyDescriptor(element, 'Sujet traité'));
  Object.defineProperty(element, 'Location',  Object.getOwnPropertyDescriptor(element, 'Emplacement'));
  Object.defineProperty(element, 'Genre',  Object.getOwnPropertyDescriptor(element, 'Genre'));
  Object.defineProperty(element, 'ISBN',  Object.getOwnPropertyDescriptor(element, 'Code ISBN'));
  Object.defineProperty(element, 'Loans',  { value: [], writable: true, enumerable: true, configurable: true });
  delete element['Emprunt'];
  delete element['Par'];
  delete element['Date'];
  delete element['Sujet traité'];
  delete element['Emplacement'];
  delete element['Code ISBN'];
  delete element['Titre'];
  delete element['Auteur·ice'];

  console.log(element);
}); 