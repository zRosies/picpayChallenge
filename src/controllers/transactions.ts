import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";

interface Payload {
  customer_info: {
    customer_id: string;
    name: string;
    cpf: string;
    email: string;
    senha: string;
    store_owner: false;
  };

  payment: {
    value: string;
    payer: string;
    payee: string;
  };
}

export const postTransacations = async (req: Request, res: Response) => {
  const body: Payload = req.body;

  console.log(body);

  if (body.customer_info.store_owner) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(403)
      .json({
        message:
          "You are not allowed to perform this operation as a store owner.",
      });
    return;
  }
  try {
    const data = await getDb()
      .db("picpay")
      .collection("transactions")
      .insertOne(body);

    if (data.acknowledged) {
      res.setHeader("Content-Type", "application/json");
      res.status(201).json({ message: "Transaction made correctly" });
    }
  } catch (error) {
    console.log({ message: error });
  }
};
