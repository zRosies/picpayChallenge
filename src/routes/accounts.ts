import express from "express";
import { createAccount } from "../controllers/accounts";

const route = express.Router();

route.post("/", createAccount);

export default route;
