import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../swagger/swaggerDoc.json";

const route = express.Router();

route.use("/", swaggerUi.serve);
route.get("/", swaggerUi.setup(swaggerDoc));

export default route;
