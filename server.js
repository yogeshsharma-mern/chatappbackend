import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.route.js";
import { connectToMongodb } from "./db/connectToMongodb.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import { app,server } from "./socket/socket.js";


// const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.0.0.2:5173",
      "https://chatwithrandomguy.vercel.app"
    ],
    credentials: true,
  })
);





app.use("/auth", authroutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectToMongodb();

  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

startServer();

