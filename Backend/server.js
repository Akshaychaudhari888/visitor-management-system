import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';

import authRoutes from './src/routes/auth.routes.js'
import userRoute from './src/routes/user.routes.js';
import visitorRoute from './src/routes/visitor.routes.js'
import errorHandler from './src/middleware/errorHandler.js';
import notFound from './src/middleware/notFound.js';



const app  = express();
dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://visitor-management-system-su7w.vercel.app"],
    credentials: true,
  })
);
app.use(morgan("dev"));

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message: "server working fine"
    })
})


app.use("/api/auth",authRoutes);
app.use('/api/user',userRoute);
app.use('/api/visitor/',visitorRoute)

app.use(notFound);
app.use(errorHandler);

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

