const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./src/modules/auth/auth.router");
const userRouter = require("./src/modules/user/user.router");
const categoryRouter = require("./src/modules/category/category.router");
const subcategoryRouter = require("./src/modules/subcategory/subcategory.router");
const brandRouter = require("./src/modules/brand/brand.router");
const productRouter = require("./src/modules/product/product.router");
const cartRouter = require("./src/modules/cart/cart.router");
const orderRouter = require("./src/modules/order/order.router");

dotenv.config();
const app = express();

// DB connection
mongoose
  .connect(process.env.CONNECTION_URI, { dbName: "e-commerce" })
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("DB failed to connect!", err));

// global middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

// not found
app.all("*", (req, res) =>
  res.status(404).json({ success: false, message: "Resource not found!" })
);

app.listen(process.env.PORT || 5000, () =>
  console.log(`e-commerce app is running!`)
);
