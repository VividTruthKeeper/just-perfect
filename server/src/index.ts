import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import "express-async-errors";
// DB
import { setupDB } from "./utils/db";

// Errors
import { DatabaseConnectionError } from "./errors/database-connection-error";
import { NotFoundError } from "./errors/not-found-error";

// Middleware
import { errorHandler } from "./middlewares/error-handler";

// Routes
import { signupRouter } from "./routes/users/signup";
import { signinRouter } from "./routes/users/singin";
import { currentUserRouter } from "./routes/users/current-user";

const app = express();
app.use(express.json());
app.use(cors());

const start = async (): Promise<void> => {
  app.use(signupRouter);
  app.use(signinRouter);
  app.use(currentUserRouter);

  // connect to db
  try {
    await setupDB();
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

void start();

export default app;
