import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const uri: string = process.env.DB_URI || "";

export const setupDB = async () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(uri)
    .then(() => console.log("mongo connected"))
    .catch((err) => console.log(err));
};
