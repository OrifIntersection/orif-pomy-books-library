import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    // Use existing database connection
    return;
  }

  if (!process.env.DATABASE) {
    throw new Error("DATABASE connection string missing");
  }

  const db = await mongoose.connect(process.env.DATABASE);
  console.log("Connected to MongoDB via Mongoose");
  isConnected = db.connections[0].readyState === 1;
}