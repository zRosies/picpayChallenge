import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";
import { Account, Transaction } from "./types";

export const postTransacations = async (req: Request, res: Response) => {
  const body: Transaction = req.body;

  // console.log(body);

  console.log(body);

  try {
    const user_info = await getDb()
      .db("picpay")
      .collection("user_account")
      .findOne({ user_id: body.payer_id });

    if (user_info?.store_owner) {
      res.setHeader("Content-Type", "application/json");
      res.status(403).json({
        error: "Store owners are not allowed to perform this operation. ",
      });
      return;
    }

    if (user_info) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({
        message: "Payload missing necessary fields.",
      });
      return;
    }

    // const data = await getDb()
    //   .db("picpay")
    //   .collection("transactions")
    //   .insertOne(body);

    // if (data.acknowledged) {
    //   res.setHeader("Content-Type", "application/json");
    //   res.status(201).json({ message: "Transaction made correctly" });
    // }
  } catch (error) {
    console.log({ message: error });
  }
};
