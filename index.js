import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

import authRouter from "./src/modules/auth/auth.router.js";
import userRouter from "./src/modules/user/user.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import reviewRouter from "./src/modules/review/review.router.js";

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("DB failed to connect!", err));

const app = express();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);

// not found
app.all("*", (req, res, next) =>
  next(
    new Error(`Can't find ${req.originalUrl} on this server!`, { cause: 404 })
  )
);

// error handler
app.use((err, req, res, next) =>
  res.status(err.cause || 500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  })
);

app.listen(process.env.PORT || 5000, () =>
  console.log(`e-commerce app is running!`)
);
