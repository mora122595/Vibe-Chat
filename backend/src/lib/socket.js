import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();

const server = http.createServer(app);

//store online users
//userSocketMap = {userId: socketId}
const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

export function getSocket(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });

  socket.on("typing", (receiverId) => {
    if (!receiverId) return;
    const receiverSocketId = getSocket(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", userId);
    }
  });

  socket.on("messageRead", async (receiverId) => {
    if (!receiverId) return;
    const receiverSocketId = getSocket(receiverId);
    await Message.updateMany(
      { senderId: receiverId, receiverId: userId, status: { $ne: "read" } },
      { $set: { status: "read" } },
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageRead", userId);
    }
  });

  socket.on("messageDelivered", async (receiverId) => {
    if (!receiverId) return;
    const receiverSocketId = getSocket(receiverId);

    await Message.updateMany(
      {
        senderId: receiverId,
        receiverId: userId,
        status: "sent",
      },
      { $set: { status: "delivered" } },
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDelivered", userId);
    }
  });

  socket.on("stopTyping", (receiverId) => {
    if (!receiverId) return;
    const receiverSocketId = getSocket(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", userId);
    }
  });
});

export { io, server, app };
