import { Client } from "pg";
import process from "process";

export const initDatabase = async (dbName: string): Promise<boolean> => {
  const client = new Client({
    host: "127.0.0.1",
    user: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    port: 5432,
  });
  try {
    await client.connect(); // gets connection
    await client.query(`CREATE DATABASE ${dbName}`); // sends queries
    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.end();
  }
};
