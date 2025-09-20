// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

// Core routers
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/Admin.route.js";

// theshan_aloka branch routes
import userReportRoutes from "./routes/userReportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// aloka branch routes
import productRouter from "./routes/Product.routes.js";
import cartRouter from "./routes/Cart.routes.js";
import orderRouter from "./routes/Order.routes.js";
import reportRoutes from "./routes/reportRoutes.js";
import cardRoutes from "./routes/Cards.routes.js";


// malithi staff management

import staffRoutes from "./routes/staffRoutes.js"; 


import packageRoutes from './routes/packageRoutes.js';

import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect DB
connectDB();

// Middleware
const allowedOrigins = ["http://localhost:5173"];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Health check
app.get("/", (req, res) => res.send("API working"));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// From theshan_aloka
app.use("/api/user-reports", userReportRoutes);
app.use("/api/notifications", notificationRoutes);

// From aloka
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reports", reportRoutes);
app.use("/api/cards", cardRoutes);

app.use("/api/staff", staffRoutes);

app.use('/api/packages',packageRoutes);

app.use("/api/bookings", bookingRoutes);

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));

/*
Keep your MongoDB URI in .env (e.g., MONGODB_URI) and ensure all imported route files exist.
*/
