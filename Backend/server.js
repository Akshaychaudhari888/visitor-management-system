import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './src/routes/auth.routes.js'
import userRoute from './src/routes/user.routes.js';
import visitorRoute from './src/routes/visitor.routes.js'

dotenv.config();

const app  = express();

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["https://visitor-management-system-su7w.vercel.app"];

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per IP per window
  message: { success: false, message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", loginLimiter);

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message: "server working fine"
    })
})


app.use("/api/auth",authRoutes);
app.use('/api/user',userRoute);
app.use('/api/visitor/',visitorRoute)

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

const connectDB  = async()=>{
    try{
        await mongoose.connect(MONGODB_URL)
        console.log("Database connected successfully")
    }catch(error){
        console.log("Database connection failed",error.message)
        process.exit(1);
    }
}

await connectDB()
    app.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})

