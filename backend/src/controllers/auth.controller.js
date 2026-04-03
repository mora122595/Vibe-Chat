import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Error logging in" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error logging out" });
  }
};

export const updateProfile = async (req, res) => {
  const { fullname, profilePicture } = req.body;
  const userId = req.user._id;

  try {
    if (!fullname && !profilePicture) {
      return res.status(400).json({ error: "At least one field is required" });
    }

    const updateData = {};
    if (fullname) updateData.fullname = fullname;

    if (profilePicture) {
      const uploadResult = await cloudinary.uploader.upload(profilePicture, {
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            quality: 80,
          },
          {
            format: "webp",
          },
        ],
      });
      updateData.profilePicture = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...user.toObject(),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating profile" });
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Could not verify user" });
  }
};
