import express from "express";
import { createAccount } from "../controllers/accounts";
import { validate, validateAccount } from "../validation/validator";

const route = express.Router();

route.post("/", validateAccount(), validate, createAccount);

export default route;
