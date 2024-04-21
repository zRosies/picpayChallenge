import express from "express";
import { getAllBalances, getBalanceById } from "../controllers/balance";
import { authentication } from "./authentication";

const route = express.Router();

route.get("/", authentication, getAllBalances);
route.get("/:user_id", authentication, getBalanceById);

export default route;
