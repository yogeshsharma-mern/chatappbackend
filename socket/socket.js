// // import { Server } from "socket.io";
// // import http from "http";
// // import express from "express";

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //     cors: {
// //         origin: '*',
// //         methods: [

// //             "GET", "POST"
// //         ]
// //     }
// // });
// // const userSocketMap={};


// // io.on("connection", (socket) => {
// //   console.log("a user connected", socket.id);

// // socket.on("setup", (userId) => {
// //     userSocketMap[userId] = socket.id;
// //     socket.userId = userId;

// //     console.log("Online users:", Object.keys(userSocketMap));

// //     // 🔥 send online users to everyone
// //     io.emit("online-users", Object.keys(userSocketMap));
// //   });
// //   socket.broadcast.emit("hello",`socket server connected ${socket.id}`);
// //   socket.on("setup",(soketId)=>
// // {
// //     console.log("onlineusersid",soketId);
// // })
// //   socket.on("disconnect", () => {
// //     console.log("user disconnected", socket.id);
// //   });

// // });



// // export { app, io, server };



// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//       origin: [
//       "http://localhost:5173",
//       "https://chatwithrandomguy.vercel.app",
//       "https://chatwithguys.vercel.app",
//       "http://localhost:5174"
//     ],
//     credentials: true,
//         methods: ["GET", "POST"],
//     },
// });

// const userSocketMap = {}; // userId -> socketId
// const activeConversations = new Map();
// io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     // 🔹 user setup
//     socket.on("setup", (userId) => {
//         userSocketMap[userId] = socket.id;
//         socket.userId = userId;

//         console.log("Online users:", Object.values(userSocketMap));


//         // 🔥 send online users to everyone
//         io.emit("online-users", Object.keys(userSocketMap));
//     });

//     // 🔹 disconnect
//     socket.on("disconnect", () => {
//         if (socket.userId) {
//             delete userSocketMap[socket.userId];
//         }

//         console.log("User disconnected:", socket.userId);

//         io.emit("online-users", Object.keys(userSocketMap));
//     });
// });

// export { app, server,io,userSocketMap };
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

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

const userSocketMap = {};              // userId -> socketId
const activeConversations = new Map(); // conversationId -> Set(userId)

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // 🔹 SETUP USER
  socket.on("setup", (userId) => {
    socket.userId = userId;
    userSocketMap[userId] = socket.id;

    io.emit("online-users", Object.keys(userSocketMap));
  });

  // 🔹 JOIN CONVERSATION
  socket.on("join-conversation", (conversationId) => {
    if (!socket.userId) return;

    if (!activeConversations.has(conversationId)) {
      activeConversations.set(conversationId, new Set());
    }

    activeConversations.get(conversationId).add(socket.userId);
  });

  // 🔹 LEAVE CONVERSATION
  socket.on("leave-conversation", (conversationId) => {
    activeConversations.get(conversationId)?.delete(socket.userId);
  });

  // 🔹 DISCONNECT
  socket.on("disconnect", () => {
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      activeConversations.forEach(set => set.delete(socket.userId));
    }

    io.emit("online-users", Object.keys(userSocketMap));
    console.log("User disconnected:", socket.userId);
  });
});

export { app, server, io, userSocketMap, activeConversations };
