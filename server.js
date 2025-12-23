import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.route.js";
import { connectToMongodb } from "./db/connectToMongodb.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import conversationRoute from "./routes/conversation.route.js"
import cors from "cors";
import { app,server } from "./socket/socket.js";
import chatroutes from "./routes/chat.routes.js"

// const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.0.0.2:5173",
      "https://chatwithrandomguy.vercel.app",
      "https://chatwithguys.vercel.app",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);





app.use("/auth", authroutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);
app.use("/api",conversationRoute);
app.use("/api/chat", chatroutes);


const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectToMongodb();

  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

startServer();

