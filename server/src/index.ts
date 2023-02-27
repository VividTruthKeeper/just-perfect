import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { json } from "body-parser";

// DB
import { setupDB } from "./utils/db";

// Errors
import { DatabaseConnectionError } from "./errors/database-connection-error";
import { NotFoundError } from "./errors/not-found-error";

// Middleware
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());
app.use(cors());

const start = (): void => {
  try {
    setupDB();
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.all("*", async () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);

  const port: string = process.env.API_PORT || "5000";
  app.listen(port, () => console.log(`Listening on ${port}`));
};

start();
