import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "../controllers/friends.controller.js";

const router = express.Router();

router.get("/list", protectRoute, getFriends);

router.get("/req-list", protectRoute, getFriendRequests);

router.post("/request/:id", protectRoute, sendFriendRequest);

router.post("/decline/:id", protectRoute, declineFriendRequest);

router.post("/accept/:id", protectRoute, acceptFriendRequest);

router.delete("/unfriend/:id", protectRoute, removeFriend);

export default router;
