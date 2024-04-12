import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/switcher";
import { Request, Response, NextFunction } from "express";
import { initDb } from "./dbConnection/connection";

dotenv.config();

const app = express();
const PORT: any = process.env.PORT || 8080;

app
  .use(bodyParser.json())
  .use(cors({ origin: "*" }))
  .use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Origin", "*");
    next();
  })
  .get("/", (req: Request, res: Response) => {
    res.send("PicPay Challenge!");
  })
  .use("/", routes);

initDb((err: Error | null) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on port ${PORT}`);
    });
  }
});

export default app;
