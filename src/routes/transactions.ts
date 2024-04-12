import express from "express";
import {
  getAllTransactions,
  getTransactionsByUserId,
  postTransacations,
  updateTransaction,
} from "../controllers/transactions";
import {
  tokenValidation,
  validate,
  validateTransaction,
} from "../validation/validator";

const route = express.Router();

route.post("/", validateTransaction(), validate, postTransacations);
route.get("/", getAllTransactions);
route.get("/:payer_id", getTransactionsByUserId);
route.put("/:transaction_id", tokenValidation, updateTransaction);

export default route;
