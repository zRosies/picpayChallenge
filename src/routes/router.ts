import express, { NextFunction } from "express";
import transaction from "./transactions";
import account from "./accounts";
import balance from "./balance";
import swagger from "./swagger";
import authentication from './authentication'

//main router
const router = express.Router();

router.use("/transactions", transaction);
router.use("/accounts", account);
router.use("/balance", balance);
router.use("/swagger", swagger);
router.use('/authentication', authentication )
export default router;
