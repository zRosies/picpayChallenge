import { Response, Request } from "express";
import { getDb } from "../dbConnection/connection";

interface Body {
  value: string;
  payer: number;
  payee: number;
}

export const postTransacations = async (req: Request, res: Response) => {
  const body: any = req.body;

  console.log(body);

  if (!body.customer_info) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ message: "Payload is required" });
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
