import User from "../models/user.model.js";

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "-password",
    );
    return res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.log("Error in getFriends: ", error.message);
    return res.status(500).json({ error: "Error fetching friends" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friendRequests",
      "-password",
    );
    return res.status(200).json({ friendRequests: user.friendRequests });
  } catch (error) {
    console.log("Error in getFriendRequests ", error.message);
    return res.status(500).json({ error: "Error fetching friend requests" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "pendingRequests",
      "-password",
    );
    return res.status(200).json({ pendingRequests: user.pendingRequests });
  } catch (error) {
    console.log("Error in getPendingRequests: ", error.message);
    return res.status(500).json({ error: "Error fetching pending requests" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const sender = req.user;
    const receiver = await User.findById(req.params.id).select(
      "friendRequests friends",
    );

    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender._id.equals(receiver._id)) {
      return res
        .status(400)
        .json({ error: "You cannot send a friend request to yourself" });
    }
    if (sender.friends.some((id) => id.equals(receiver._id))) {
      return res
        .status(409)
        .json({ error: "You are already friends with this user" });
    }
    if (receiver.friendRequests.some((id) => id.equals(sender._id))) {
      return res
        .status(409)
        .json({ error: "You have already sent a friend request to this user" });
    }

    await User.findByIdAndUpdate(
      receiver._id,
      { $addToSet: { friendRequests: sender._id } },
      { new: true },
    );
    await User.findByIdAndUpdate(
      sender._id,
      { $addToSet: { pendingRequests: receiver._id } },
      { new: true },
    );

    // Emit socket event to notify receiver
    const { io, getSocket } = await import("../lib/socket.js");
    const receiverSocketId = getSocket(receiver._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newRequest", {
        _id: sender._id,
        fullname: sender.fullname,
        email: sender.email,
        profilePic: sender.profilePicture,
      });
    }

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.log("Error in sendFriendRequest: ", error.message);
    return res.status(500).json({ error: "Error sending friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const senderId = req.params.id;
  const receiverId = req.user._id;
  try {
    if (!req.user.friendRequests.some((id) => id.equals(senderId))) {
      return res.status(404).json({ error: "No friend request from user" });
    }
    await User.findByIdAndUpdate(
      receiverId,
      { $addToSet: { friends: senderId }, $pull: { friendRequests: senderId } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      receiverId,
      { $pull: { pendingRequests: senderId } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      senderId,
      {
        $addToSet: { friends: receiverId },
        $pull: { pendingRequests: receiverId },
      },
      { new: true },
    );

    return res
      .status(200)
      .json({ message: "friend added succesfully!", friendId: senderId });
  } catch (error) {
    console.log("Error in acceptingRequest", error.message);
    return res.status(500).json({ error: "Error accepting request" });
  }
};

export const declineFriendRequest = async (req, res) => {
  const senderId = req.params.id;
  const receiverId = req.user._id;
  try {
    if (!req.user.friendRequests.some((id) => id.equals(senderId))) {
      return res.status(404).json({ error: "No friend request from user" });
    }
    await User.findByIdAndUpdate(
      receiverId,
      { $pull: { friendRequests: senderId } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      senderId,
      { $pull: { pendingRequests: receiverId } },
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "Friend request declined successfully" });
  } catch (error) {
    console.log("Error in declineFriendRequest: ", error.message);
    return res.status(500).json({ error: "Error declining request" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    if (!req.user.friends.some((id) => id.equals(friendId))) {
      return res.status(404).json({ error: "No friend Found" });
    }
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { friends: friendId } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: req.user._id } },
      { new: true },
    );

    return res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.log("Error in removeFriend", error.message);
    return res.status(500).json({ error: "Error removing friend from list" });
  }
};

export const removeRequest = async (req, res) => {
  try {
    const friendId = req.params.id;
    if (!req.user.pendingRequests.some((id) => id.equals(friendId))) {
      return res.status(404).json({ error: "No friend Request Found" });
    }
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { pendingRequests: friendId } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friendRequests: req.user._id } },
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "Friend request removed successfully" });
  } catch (error) {
    console.log("Error in removeFriend", error.message);
    return res.status(500).json({ error: "Error removing friend from list" });
  }
};
