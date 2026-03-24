import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoginIn: false,
  isUpdatingProfile: false,
  isLoginOut: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({
        authUser: res.data,
      });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("Error in checkAuth: ", error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (email, password, fullname) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", {
        email,
        password,
        fullname,
      });
      set({
        authUser: res.data.user,
      });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
      console.log("Error in SignUp: ", error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  loginIn: async (email, password) => {
    set({ isLoginIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      set({
        authUser: res.data.user,
      });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      console.log("Error in Login: ", error.message);
    } finally {
      set({ isLoginIn: false });
    }
  },
  logout: async () => {
    set({ isLoginOut: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({
        authUser: null,
      });
      toast.success(res.data.message);
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.error || "Logout failed");
      console.log("Error in Logout: ", error.message);
    } finally {
      set({ isLoginOut: false });
    }
  },
  updateProfile: async (fullname, email, profilePicture) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", {
        fullname,
        profilePicture,
      });
      set({
        authUser: res.data.user,
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Update profile failed");
      console.log("Error in Update Profile: ", error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    if (!get().authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: get().authUser._id,
      },
    });
    socket.connect();
    set({ socket });

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));

export default useAuthStore;
