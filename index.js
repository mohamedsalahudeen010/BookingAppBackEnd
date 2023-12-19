import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnection from "./DB.js";
import { authRoute } from "./routes/auth.js";
import { usersRoute } from "./routes/user.js";
import { hotelsRoute } from "./routes/hotel.js";
import { roomsRoute } from "./routes/rooms.js";

const app = express();
dotenv.config();
app.use(cors())
// app.use(cookieParser())
app.use(express.json());
dbConnection()
const PORT=process.env.PORT


mongoose.connection.on("disconnected", () => {
  dbConnection()
  console.log("mongoDB disconnected!");
});

//middlewares


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
 
  console.log("Connected to backend.");
});

app.get("/",async(req,res)=>{
  res.send(`Web server Is Hoisted In ${PORT} Port Number`)
})


