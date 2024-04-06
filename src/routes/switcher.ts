import express, { NextFunction } from "express";
import transaction from "./transactions";
import account from "./accounts";

//main router
const router = express.Router();

router.use("/transactions", transaction);
router.use("/accounts", account);

export default router;
