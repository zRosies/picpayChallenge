import express, { NextFunction } from "express";
import transaction from "./transactions";

//main router
const router = express.Router();

router.use("/transactions", transaction);

export default router;
