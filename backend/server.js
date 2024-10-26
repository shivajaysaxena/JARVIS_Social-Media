import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config(path.resolve('../.env'));

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const app = express();
const PORT = process.env.PORT || 5000
const __dirname = path.resolve();

app.use(express.json({
    limit: "5mb",
})) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.use(cookieParser());


app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notification", notificationRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname,'../','frontend', 'dist', 'index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log(`Sever is runnning on port ${PORT}`)
    connectDB();
})