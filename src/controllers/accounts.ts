import { Response, Request } from "express";
import { getDb } from "../connection/connection";
import { Account, UpdateAccount } from "./schema";
import bcrypt from "bcryptjs";

export const createAccount = async (req: Request, res: Response) => {
  const body: Account = req.body;

  try {
    const existingUser = await getDb()
      .db("picpay")
      .collection("user_account")
      .findOne({ $or: [{ email: body.email }, { cpf: body.cpf }] });

    if (existingUser) {
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

      getDb().db("picpay").collection("balance").insertOne({
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

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    // Adding a new account information and a balance for the new user account.

    const response = await getDb()
      .db("picpay")
      .collection("user_account")
      .find()
      .toArray();

    if (!response) {
      return res.status(404).json({ message: "no data found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log({ message: error });
  }
};

export const getAllAccountById = async (req: Request, res: Response) => {
  try {
    const response = await getDb()
      .db("picpay")
      .collection("user_account")
      .findOne({ user_id: req.params.user_id });

    if (!response) {
      return res.status(404).json({ message: "No account found with this ID" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log({ message: error });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  let updateAccount: UpdateAccount = req.body;

  // Just in case the password is changed
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 5);

    updateAccount = {
      ...req.body,
      password: hashedPassword,
    };
  }

  try {
    const response = await getDb()
      .db("picpay")
      .collection("user_account")
      .updateOne({ user_id: req.params.user_id }, { $set: updateAccount });

    if (!response) {
      return res.status(404).json({ message: "No account found with this ID" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log({ message: error });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const response = await getDb()
      .db("picpay")
      .collection("user_account")
      .deleteOne({ user_id: req.params.user_id });

    if (!response) {
      return res.status(404).json({ message: "No account found with this ID" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log({ message: error });
  }
};
