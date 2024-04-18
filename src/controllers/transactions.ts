import { Response, Request } from "express";
import { getDb } from "../connection/connection";
import { Account, Balance, Transaction } from "./schema";
import { ObjectId } from "mongodb";

export const postTransacations = async (req: Request, res: Response) => {
  const transaction: Transaction = req.body;

  // ----- Forbidding store owners to be able to transfer -----
  // ----- Sending the failed transaction to the db -----------
  // ----- Checking if all requirements are met ---------------
  try {
    const [user_info, receiver_balance] = await Promise.all([
      getDb()
        .db("picpay")
        .collection("user_account")
        .findOne({ user_id: transaction.payer_id }),
      getDb()
        .db("picpay")
        .collection("balance")
        .findOne({ user_id: transaction.payer_id }),
    ]);

    if (!user_info) {
      return res.status(404).json({
        error: "No payer_id associated with this transaction",
      });
    } else if (receiver_balance?.balance < transaction.value) {
      console.log(receiver_balance?.balance);
      console.log(transaction?.value);

      return res.status(412).json({
        error: "You have no sufficient money to complete this operation",
      });
    } else if (user_info?.store_owner || transaction.value > 50000) {
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

    if (!receiver_info) {
      return res
        .status(404)
        .json({ messaage: "The transaction receiver does not exist" });
    }

    const newReceiverBalance = receiver_info?.balance + transaction.value;
    const newPayerBalance = receiver_balance?.balance - transaction.value;

    const [receiverBalanceUpdated, transactionSent, senderBalanceUpdated] =
      await Promise.all([
        getDb()
          .db("picpay")
          .collection("balance")
          .updateOne(
            { user_id: transaction.receiver_id },
            { $set: { ...receiver_info, balance: newReceiverBalance } }
          ),

        getDb()
          .db("picpay")
          .collection("transactions")
          .insertOne({ ...transaction, status: "success" }),
        getDb()
          .db("picpay")
          .collection("balance")
          .updateOne(
            { user_id: receiver_balance?.user_id },
            { $set: { ...receiver_balance, balance: newPayerBalance } }
          ),
      ]);

    if (
      receiverBalanceUpdated.acknowledged &&
      transactionSent.acknowledged &&
      senderBalanceUpdated.acknowledged
    ) {
      res.status(201).json({ message: "Transaction completed sucessfuly" });
    }
    return;
  } catch (error) {
    console.log({ message: error });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const response = await getDb()
      .db("picpay")
      .collection("transactions")
      .find()
      .toArray();

    if (response.length > 0) {
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log({ message: error });
  }
};

export const getTransactionsByUserId = async (req: Request, res: Response) => {
  try {
    const response = await getDb()
      .db("picpay")
      .collection("transactions")
      .find({ payer_id: req.params.payer_id })
      .toArray();

    if (response.length === 0) {
      res
        .status(404)
        .json({ message: "No transacation found for this payer_id" });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.log({ message: error });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const response = await getDb()
      .db("picpay")
      .collection("user_account")
      .updateOne({ _id: new ObjectId(req.params.transacation_id) }, req.body);

    if (!response) {
      return res.status(404).json({ message: "No account found with this ID" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log({ message: error });
  }
};
