import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Picpay",
    description: "Bank plataform",
  },
  host: "http://localhost:8080",
  schemas: ["http"],
};

const outputFile = "./src/swagger/swaggerDoc.json";
const routes = ["./src/routes/switcher.ts"];

swaggerAutogen(outputFile, routes, doc);
