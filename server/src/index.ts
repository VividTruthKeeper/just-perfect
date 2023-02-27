import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { json } from "body-parser";

// DB
import { setupDB } from "./utils/db";

// Errors
import { DatabaseConnectionError } from "./errors/database-connection-error";

const app = express();
app.use(json());
app.use(cors());

try {
  setupDB();
} catch (err) {
  throw new DatabaseConnectionError();
}

const port: string = process.env.API_PORT || "5000";
app.listen(port, () => console.log(`Listening on ${port}`));
