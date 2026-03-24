import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsers,
  getConversation,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);

router.get("/conversation/:id", protectRoute, getConversation);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
