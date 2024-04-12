import express, { NextFunction } from "express";
import transaction from "./transactions";
import account from "./accounts";
import balance from "./balance";
import swagger from "./swagger";

//main router
const router = express.Router();

router.use("/transactions", transaction);
router.use("/accounts", account);
router.use("/balance", balance);
router.use("/swagger", swagger);
export default router;
