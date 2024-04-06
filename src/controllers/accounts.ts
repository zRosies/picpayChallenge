import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";
import { Account } from "./types";

export const createAccount = async (req: Request, res: Response) => {
  const body: Account = req.body;

  if (!body.user_id) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).json({
      message: "Payload missing necessary fields.",
    });
    return;
  }

  try {
    const existingUser = await getDb()
      .db("picpay")
      .collection("user_account")
      .findOne({ $or: [{ email: body.email }, { cpnj: body.cpf }] });

    if (existingUser) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({
        message: "Email ou CPF em uso.",
      });
      return;
    }

    const data = await getDb()
      .db("picpay")
      .collection("user_account")
      .insertOne(body);

    if (data.acknowledged) {
      res.setHeader("Content-Type", "application/json");
      res.status(201).json({ message: "Account created successfuly" });
    }
  } catch (error) {
    console.log({ message: error });
  }
};
