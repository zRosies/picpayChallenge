import express, { NextFunction } from "express";
import transaction from "./transactionS";
import account from "./accounts";

//main router
const router = express.Router();

router.use("/transactions", transaction);
router.use("/accounts", account);

export default router;
