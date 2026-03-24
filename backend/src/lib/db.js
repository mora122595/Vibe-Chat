import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};

export default connectDB;
