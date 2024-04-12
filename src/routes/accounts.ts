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

const route = express.Router();

route.post("/", tokenValidation, validateAccount(), validate, createAccount);
route.get("/", getAllAccounts);
route.get("/:user_id", getAllAccountById);
route.put("/:user_id", tokenValidation, updateAccount);
route.delete("/:user_id", tokenValidation, deleteAccount);

export default route;
