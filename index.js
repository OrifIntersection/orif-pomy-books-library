// dependencies
const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

// global environment vars
dotenv.config({ path: "./config.env" });

// connect to database
/* const client = new MongoClient(process.env.DATABASE, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// call the run function to connect to the database
run().catch(console.dir); */


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
const booksRouter = require("./dev-data/routes/booksRoute.js");
app.use("/api/v1/books", booksRouter);

// handle all other routes
app.get("/public/main.js", (req, res) => {
  res.status(200).sendFile("public/main.js", { root: "." });
});

app.all("*all", (req, res) => {
  res.status(200).sendFile("public/index.html", { root: "." });
});

