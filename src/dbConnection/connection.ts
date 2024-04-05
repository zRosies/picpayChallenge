import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db: MongoClient | null = null;

const initDb = (
  callback: (error: Error | null, db: MongoClient | null) => void
) => {
  if (db) {
    console.log("Db is already initialized!");
    return callback(null, db);
  }
  MongoClient.connect(process.env.URI || "")
    .then((client) => {
      db = client;
      callback(null, db);
    })
    .catch((err) => {
      callback(null, err);
    });
};

const getDb = () => {
  if (!db) {
    throw new Error("Db not intialized!");
  }
  return db;
};
export { initDb, getDb };
