import express from "express";
import { postTransacations } from "../controllers/transactions";
import { validate, validateTransaction } from "../validation/validator";

const route = express.Router();

route.post("/", validateTransaction(), validate, postTransacations);

export default route;
