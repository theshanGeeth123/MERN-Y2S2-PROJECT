import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from './routes/Admin.route.js';
import rentalRoutes from "./routes/mRental.route.js";
import paymentRoutes from "./routes/mPayment.route.js";



const app = express();

const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

// API Endpoint 
app.get("/",(req,res)=>res.send("API working"));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);

app.use("/api/rentalItems",rentalRoutes)
app.use("/api/payment", paymentRoutes);

app.listen(port,()=>console.log(`Server started on PORT:${port}
`));

//greatstack123

//mongodb+srv://greatstack:<db_password>@cluster0.cui2so9.mongodb.net/