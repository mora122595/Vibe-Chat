import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import friendsRoutes from "./routes/friends.route.js";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friends", friendsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
