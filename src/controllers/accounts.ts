import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";
import { Account } from "./schema";
import bcrypt from "bcryptjs";

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
      .findOne({ $or: [{ email: body.email }, { cpf: body.cpf }] });

    if (existingUser) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({
        message: "email or cpf already in use.",
      });
      return;
    }

    // Adding a new account information and a balance for the new user account.
    const hashedPassword = await bcrypt.hash(body.password, 5);

    const [userData, balanceData] = await Promise.all([
      getDb()
        .db("picpay")
        .collection("user_account")
        .insertOne({ ...body, password: hashedPassword }),

      getDb().db("picpay").collection("user_account").insertOne({
        user_id: body.user_id,
        balance: 0,
      }),
    ]);

    if (userData.acknowledged) {
      res.setHeader("Content-Type", "application/json");
      res.status(201).json({ message: "Account created successfuly" });
    }
  } catch (error) {
    console.log({ message: error });
  }
};
