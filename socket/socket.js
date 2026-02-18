
// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://chatwithrandomguy.vercel.app",
//       "https://chatwithguys.vercel.app",
//       "http://localhost:5174"
//     ],
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {};              // userId -> socketId
// const activeConversations = new Map(); // conversationId -> Set(userId)


// io.on("connection", (socket) => {
//   // console.log("socket",socket);
//   console.log("Socket connected:", socket.id);

//   // 🔹 SETUP USER
//   socket.on("setup", (userId) => {

//     socket.userId = userId;
//     //before
//     // socket = { id: "XYZ123" }
//     //after
//     //     socket = { 
//     //   id: "XYZ123",
//     //   userId: "user123"
//     // }
//     userSocketMap[userId] = socket.id;
//  console.log("✅ Setup:", userId, "→", socket.id);
//   console.log("🗺 Current Map:", userSocketMap);
//     io.emit("online-users", Object.keys(userSocketMap));
//     console.log(
//       "userSocketMap", userSocketMap
//     );
//   });

//   // 🔹 JOIN CONVERSATION
//   socket.on("join-conversation", (conversationId) => {
//     if (!socket.userId) return;

//     if (!activeConversations.has(conversationId)) {
//       activeConversations.set(conversationId, new Set());
//     }

//     activeConversations.get(conversationId).add(socket.userId);
//   });

//   // 🔹 LEAVE CONVERSATION
//   socket.on("leave-conversation", (conversationId) => {
//     activeConversations.get(conversationId)?.delete(socket.userId);
//   });

//   socket.on("typing", ({ conversationId }) => {
//     console.log("converstationId", conversationId);
//     if (!socket.userId) return;

//     const users = activeConversations.get(conversationId);
//     console.log("users", users);
//     if (!users) return;

//     users.forEach(userId => {
//       if (userId !== socket.userId) {
//         const socketId = userSocketMap[userId];
//         if (socketId) {
//           io.to(socketId).emit("typing", {
//             conversationId,
//             userId: socket.userId,
//           });
//         }
//       }
//     });
//   });
//   socket.on("stop-typing", ({ conversationId }) => {

//     if (!socket.userId) return;

//     const users = activeConversations.get(conversationId);
//     if (!users) return;

//     users.forEach(userId => {
//       if (userId !== socket.userId) {
//         const socketId = userSocketMap[userId];
//         if (socketId) {
//           io.to(socketId).emit("stop-typing", {
//             conversationId,
//             userId: socket.userId,
//           });
//         }
//       }
//     });
//   });
// socket.on("call-user", (data) => {

//   const targetSocketId = userSocketMap[data.to];

//   if (!targetSocketId) {
//     console.log("❌ User not online:", data.to);
//     return;
//   }

//   console.log("📞 Calling user:", data.to, "socket:", targetSocketId);

//   io.to(targetSocketId).emit("incoming-call", {
//     from: socket.userId,
//     offer: data.offer,
//     callType: data.callType,
//   });
// });

// socket.on("answer-call", (data) => {
//   const targetSocketId = userSocketMap[data.to];
//   if (!targetSocketId) return;

//   io.to(targetSocketId).emit("call-answered", data);
// });


// socket.on("ice-candidate", (data) => {
//   const targetSocketId = userSocketMap[data.to];
//   if (!targetSocketId) return;

//   io.to(targetSocketId).emit("ice-candidate", data);
// });


// socket.on("end-call", (data) => {
//   const targetSocketId = userSocketMap[data.to];
//   if (!targetSocketId) return;

//   io.to(targetSocketId).emit("end-call");
// });



//   // 🔹 DISCONNECT
//   socket.on("disconnect", () => {
//     if (socket.userId) {
//       delete userSocketMap[socket.userId];
//       activeConversations.forEach(set => set.delete(socket.userId));
//     }

//     io.emit("online-users", Object.keys(userSocketMap));
//     console.log("User disconnected:", socket.userId);
//   });
// });


// export { app, server, io, userSocketMap, activeConversations };
console.log("📦 socket.js is loading...");

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

console.log("🔧 Creating Socket.IO server...");

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatwithrandomguy.vercel.app",
      "https://chatwithguys.vercel.app",
      "http://localhost:5174"
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

console.log("✅ Socket.IO server created");

const userSocketMap = {};              // userId -> socketId
const activeConversations = new Map(); // conversationId -> Set(userId)

io.on("connection", (socket) => {
 console.log("🔌🔌🔌 NEW SOCKET CONNECTION! 🔌🔌🔌");
  console.log("🔌 Socket ID:", socket.id);
  console.log("🔌 Total connections so far:", Object.keys(userSocketMap).length);

  // Log ALL events received
  socket.onAny((eventName, ...args) => {
    console.log(`📥 [SERVER] Event received: "${eventName}"`, args);
  });

  // 🔹 SETUP USER
  socket.on("setup", (userId) => {
    console.log("🆔 SETUP received for user:", userId);
    socket.userId = userId;
    userSocketMap[userId] = socket.id;
    console.log("✅ User setup complete. Current map:", userSocketMap);
    io.emit("online-users", Object.keys(userSocketMap));
  });

  // 🔹 CALL USER
  socket.on("call-user", (data) => {
    console.log("🔥🔥🔥 CALL-USER EVENT RECEIVED! 🔥🔥🔥");
    console.log("📞 From user:", socket.userId);
    console.log("📞 To user:", data.to);
    console.log("📞 Call type:", data.callType);
    console.log("📞 Current user map:", userSocketMap);

    const targetSocketId = userSocketMap[data.to];

    if (!targetSocketId) {
      console.log("❌ Target user not online:", data.to);
      socket.emit("user-offline", { userId: data.to });
      return;
    }

    console.log("✅ Target socket ID:", targetSocketId);
    io.to(targetSocketId).emit("incoming-call", {
      from: socket.userId,
      offer: data.offer,
      callType: data.callType,
    });
    console.log("✅ Call forwarded");
  });

  // 🔹 DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ DISCONNECT:", socket.id);
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      io.emit("online-users", Object.keys(userSocketMap));
    }
  });
});

console.log("📦 socket.js exports ready");

export { app, server, io, userSocketMap, activeConversations };