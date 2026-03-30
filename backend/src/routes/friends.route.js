import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getPendingRequests,
  removeRequest,
} from "../controllers/friends.controller.js";

const router = express.Router();

router.get("/list", protectRoute, getFriends);

router.get("/requests", protectRoute, getFriendRequests);

router.post("/request/:id", protectRoute, sendFriendRequest);

router.patch("/decline/:id", protectRoute, declineFriendRequest);

router.patch("/accept/:id", protectRoute, acceptFriendRequest);

router.delete("/unfriend/:id", protectRoute, removeFriend);

router.get("/pending-requests", protectRoute, getPendingRequests);

router.delete("/remove-request/:id", protectRoute, removeRequest);

export default router;
