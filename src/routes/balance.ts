import express from "express";
import { getAllBalances, getBalanceById } from "../controllers/balance";
import { tokenValidation } from "../validation/validator";

const route = express.Router();

route.get("/", tokenValidation, getAllBalances);
route.get("/:user_id", tokenValidation, getBalanceById);

export default route;
