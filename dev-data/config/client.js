import mongoConnect from "./mongoConnect.js";

export const client = await mongoConnect(process.env.DATABASE);