import dotenv = require("dotenv");
import express = require("express");
import Product from "./routes/products";
import Auth from "./routes/auth";
import errorHandler from "./middlewares/errorHandler";
import logger from "./middlewares/logger";
import verifyToken from "./middlewares/verifyToken";
import bodyParser from "body-parser";

dotenv.config();

// const secretKey = crypto.randomBytes(32).toString("hex");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT;

app.use(logger);
app.use("/api/products", verifyToken);
app.use("/api/products", Product);
app.use("/api/auth", Auth);
app.use("/api/users", Auth);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Сервер ${port} порт дээр ажиллаж байна...`);
});

export default app;
