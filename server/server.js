// server.js (or index.js)
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

// Routers
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/Admin.route.js";
import productRouter from "./routes/Product.routes.js";
import cartRouter from "./routes/Cart.routes.js";
import orderRouter from "./routes/Order.routes.js";
import cardRoutes from "./routes/Cards.routes.js";
import reportRoutes from "./routes/report.routes.js"; // ← unified reports router

const app = express();

const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Endpoints
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cards", cardRoutes);
app.use("/api/reports", reportRoutes); // user + sales analytics in one router

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

// greatstack123
// mongodb+srv://greatstack:<db_password>@cluster0.cui2so9.mongodb.net/
