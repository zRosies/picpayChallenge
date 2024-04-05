import express from "express";
import { Request, Response } from "express";
import { postTransacations } from "../controllers/transactions";

const route = express.Router();

route.post("/", postTransacations);

export default route;
