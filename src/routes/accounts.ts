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
import { authentication } from "./authentication";

const route = express.Router();

route.post("/", authentication, validateAccount(), validate, createAccount);
route.get("/", getAllAccounts);
route.get("/:user_id", getAllAccountById);
route.put("/:user_id", authentication, updateAccount);
route.delete("/:user_id", authentication, deleteAccount);

export default route;
