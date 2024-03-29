import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Product from "./routes/Product.route";
import Auth from "./routes/auth";
import OrderRoute from "./routes/Order.route";
import errorHandler from "./middlewares/errorHandler";
import logger from "./middlewares/logger";
import { verifyToken } from "./middlewares/verifyToken";
import bodyParser from "body-parser";
import swaggerSpec from "./utils/swagger";
dotenv.config();

// const secretKey = crypto.randomBytes(32).toString("hex");
const app = express();

const corsOption = { origin: ["http://localhost:3000"] };

app.use(cors(corsOption));

app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT;

app.use(logger);
app.use("/api/products", verifyToken, Product);
app.use("/api/auth", Auth);
app.use("/api/order", OrderRoute);

app.use(errorHandler);

app.listen(port, () => {
  swaggerSpec(app, parseInt(port as string));
  console.log(`Сервер ${port} порт дээр ажиллаж байна...`);
});

export default app;
