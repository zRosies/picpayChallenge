import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";
import { Account, Balance, Transaction } from "./schema";

export const postTransacations = async (req: Request, res: Response) => {
  const transaction: Transaction = req.body;

  // ----- Forbidding store owners to be able to transfer -----
  // ----- Sending the failed transaction to the db -----------
  try {
    const user_info = await getDb()
      .db("picpay")
      .collection("user_account")
      .findOne({ user_id: transaction.payer_id });

    if (user_info?.store_owner || transaction.value > 50000) {
      const failedTransaction = { ...transaction, status: "blocked" };

      const data = await getDb()
        .db("picpay")
        .collection("transactions")
        .insertOne(failedTransaction);

      if (data.acknowledged) {
        res.status(403).json({
          error: "You are not allowed to perform this operation. ",
        });
        return;
      }
    }

    // --- Sending the successful transaction -----
    // --- Delivering the money to the receiver----

    const receiver_info = await getDb()
      .db("picpay")
      .collection("balance")
      .findOne({ user_id: transaction.receiver_id });

    const newBalance = receiver_info?.balance + transaction.value;

    const [balanceUpdated, transactionSent] = await Promise.all([
      getDb()
        .db("picpay")
        .collection("balance")
        .updateOne(
          { user_id: transaction.receiver_id },
          { $set: { ...receiver_info, balance: newBalance } }
        ),
      getDb()
        .db("picpay")
        .collection("transactions")
        .insertOne({ ...transaction, status: "success" }),
    ]);

    if (balanceUpdated.acknowledged && transactionSent.acknowledged) {
      // res.setHeader("Content-Type", "application/json");
      res.status(201).json({ message: "Transaction completed sucessfuly" });
    }
  } catch (error) {
    console.log({ message: error });
  }
};
