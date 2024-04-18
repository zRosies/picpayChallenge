import express from "express";
import {
  createAccount,
  deleteAccount,
  getAllAccountById,
  getAllAccounts,
  updateAccount,
} from "../controllers/accounts";
import {
  tokenValidation,
  validate,
  validateAccount,
} from "../validation/validator";

import { authenticateToken } from "./authentication";

const route = express.Router();

route.post("/", tokenValidation, validateAccount(), validate, createAccount);
route.get("/", authenticateToken, getAllAccounts);
route.get("/:user_id", authenticateToken, getAllAccountById);
route.put("/:user_id", tokenValidation, updateAccount);
route.delete("/:user_id", tokenValidation, deleteAccount);

export default route;
