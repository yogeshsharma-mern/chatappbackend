// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: [

//             "GET", "POST"
//         ]
//     }
// });
// const userSocketMap={};


// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

// socket.on("setup", (userId) => {
//     userSocketMap[userId] = socket.id;
//     socket.userId = userId;

//     console.log("Online users:", Object.keys(userSocketMap));

//     // 🔥 send online users to everyone
//     io.emit("online-users", Object.keys(userSocketMap));
//   });
//   socket.broadcast.emit("hello",`socket server connected ${socket.id}`);
//   socket.on("setup",(soketId)=>
// {
//     console.log("onlineusersid",soketId);
// })
//   socket.on("disconnect", () => {
//     console.log("user disconnected", socket.id);
//   });

// });



// export { app, io, server };



import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: [
      "http://localhost:5173",
      "https://chatwithrandom.vercel.app"
    ],
    credentials: true,
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // userId -> socketId

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔹 user setup
    socket.on("setup", (userId) => {
        userSocketMap[userId] = socket.id;
        socket.userId = userId;

        console.log("Online users:", Object.values(userSocketMap));

        // 🔥 send online users to everyone
        io.emit("online-users", Object.keys(userSocketMap));
    });

    // 🔹 disconnect
    socket.on("disconnect", () => {
        if (socket.userId) {
            delete userSocketMap[socket.userId];
        }

        console.log("User disconnected:", socket.userId);

        io.emit("online-users", Object.keys(userSocketMap));
    });
});

export { app, server,io,userSocketMap };
