import dotenv from "dotenv";

import cors from "cors";
import express from "express";
import "reflect-metadata";
import "express-async-errors";
import { json } from "body-parser";
dotenv.config();

// Routes
import { currentUserRouter } from "./routes/user/current-user";
import { deleteUserRouter } from "./routes/user/delete-user";
import { signinRouter } from "./routes/user/signin";
import { signoutRouter } from "./routes/user/signout";
import { signupRouter } from "./routes/user/signup";
import { updateUserRouter } from "./routes/user/update-user";
import { changePasswordRouter } from "./routes/user/change-password";

// Middlewares
import { errorHandler } from "./middlewares/error-handler";

// Errors
import { NotFoundError } from "./errors/not-found-error";
import { DatabaseConnectionError } from "./errors/database-connection-error";

// DB
import { sequelize } from "./instances/sequelize";
import { initDatabase } from "./functions/initDatabase";

const app = express();

app.use(json());
app.use(cors());

const start = async (): Promise<void> => {
  app.use(currentUserRouter);
  app.use(signinRouter);
  app.use(signoutRouter);
  app.use(signupRouter);
  app.use(updateUserRouter);
  app.use(changePasswordRouter);
  app.use(deleteUserRouter);

  try {
    await sequelize.authenticate();
  } catch (err) {
    console.log(err);
    initDatabase(process.env.DB_NAME || "");
  }

  try {
    await sequelize.sync();
  } catch (err) {
    console.log(err);
    throw new DatabaseConnectionError();
  }

  app.all("*", async () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);

  const port = process.env.API_PORT || 8080;

  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
};

void start();

export default app;
