import { Sequelize } from "sequelize-typescript";
import process from "process";

// Models
import { User } from "../models/user";
import { initDatabase } from "../functions/initDatabase";

const db: string = process.env.DB_NAME || "";

const username = process.env.DB_USERNAME || "";
const password = process.env.DB_PASSWORD || "";

export const sequelize = new Sequelize({
  database: db,
  dialect: "postgres",
  username: username,
  password: password,
  storage: ":memory:",
});

sequelize.addModels([User]);
