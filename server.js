import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import paymentRoutes from "./routes/payment.js";
import imageRoutes from "./routes/image.js";
import telegramBot from "./admin/telegram/telegramClient.ts";

const app = express();

//configuration of dotenv
dotenv.config();

//Database config
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.disable("x-powered-by");

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/payments", paymentRoutes);
app.use("/uploads", imageRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to ecommerce MERN stack app",
  });
});

telegramBot
  .launch()
  .then(() => console.log("Telegram bot started"))
  .catch((err) => console.error("Error starting Telegram bot:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `  Server is listening on ${process.env.DEV_MODE} on port ${PORT}  `.bgCyan
      .white
  );
});
