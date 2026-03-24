import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getSocket, io } from "../lib/socket.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password",
    );
    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers: ", error.message);
    return res.status(500).json({ error: "Eror Fetching Users" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const otherUserId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getConversation: ", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;
    let uploadResult = null;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    if (!text && !image) {
      return res
        .status(400)
        .json({ error: "Text or image is required to send a message" });
    }

    if (image) {
      uploadResult = await cloudinary.uploader.upload(image);
    }

    const newMessage = new Message({
      senderId: loggedInUserId,
      receiverId: receiverId,
      text: text || "",
      image: uploadResult ? uploadResult.secure_url : "",
    });

    const savedMessage = await newMessage.save();

    const receiverSocketId = getSocket(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", savedMessage);
    }

    return res.status(201).json(savedMessage);
  } catch (error) {
    console.log("Error in sendMessage: ", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};
