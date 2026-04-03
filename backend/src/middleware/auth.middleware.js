import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Not authorized - token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Not authorized - token invalid" });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorized - user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
