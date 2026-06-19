import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
connectDB();

import express from "express";
import cors from "cors";

import productRouter from "./src/routes/product.router.js";
import authRouter from "./src/routes/auth.router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Bienvenidos a la API de productos de PC" });
});

app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);

export default app;
