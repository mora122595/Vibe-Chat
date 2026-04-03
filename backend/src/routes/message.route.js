import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsers,
  getConversation,
  sendMessage,
  getUnreadCounts,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);

router.get("/conversation/:id", protectRoute, getConversation);

router.post("/send/:id", protectRoute, sendMessage);

router.get("/unread", protectRoute, getUnreadCounts);

export default router;
