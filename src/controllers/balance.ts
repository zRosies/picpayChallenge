import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";

export const getAllBalances = async (req: Request, res: Response) => {
  try {
    // Adding a new account information and a balance for the new user account.

    const response = await getDb()
      .db("picpay")
      .collection("balance")
      .find()
      .toArray();

    if (response.length > 0) {
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log({ message: error });
  }
};

export const getBalanceById = async (req: Request, res: Response) => {
  try {
    const response = await getDb()
      .db("picpay")
      .collection("balance")
      .findOne({ user_id: req.params.user_id });

    if (response?.acknowledged) {
      return res
        .status(200)
        .json({ message: `Account ${req.params.user_id} deleted succesfuly` });
    }

    res.status(404).json({ message: "No balance found with this ID" });
  } catch (error) {
    console.log({ message: error });
  }
};
