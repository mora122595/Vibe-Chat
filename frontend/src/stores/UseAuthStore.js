import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import useChatStore from "./UseChatStore.js";
import useFriendsStore from "./UseFriendsStore.js";
import * as Sentry from "@sentry/react";

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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
    } finally {
      set({ isLoginOut: false });
    }
  },
  updateProfile: async (fullname, profilePicture) => {
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
      Sentry.captureException(error);
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

    socket.on("newMessage", (message) => {
      const { incrementUnreadMessages, selectedUser, users } =
        useChatStore.getState();

      const isMessageForSelectedChat =
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id;

      if (message.senderId === get().authUser._id) return;

      if (isMessageForSelectedChat) {
        useChatStore.setState((state) => ({
          chatHistory: [...state.chatHistory, message],
        }));
        socket.emit("messageRead", message.senderId);
      } else {
        socket.emit("messageDelivered", message.senderId);
        const sender = users.find((u) => u._id === message.senderId);
        if (sender) toast.success(`New message from ${sender.fullname}`);
        incrementUnreadMessages(message.senderId);
      }
    });

    socket.on("typing", (userId) => {
      const { selectedUser } = useChatStore.getState();
      if (userId === selectedUser?._id) {
        useChatStore.setState({ isTyping: true });
      }
    });

    socket.on("stopTyping", (userId) => {
      const { selectedUser } = useChatStore.getState();
      if (userId === selectedUser?._id) {
        useChatStore.setState({ isTyping: false });
      }
    });

    socket.on("newRequest", (request) => {
      const { friendRequests } = useFriendsStore.getState();
      useFriendsStore.setState({
        friendRequests: [...friendRequests, request],
      });
      toast.success(`New friend request from ${request.fullname}`);
    });

    socket.on("messageRead", (receiverId) => {
      const { selectedUser, resetUnreadMessages } = useChatStore.getState();
      if (receiverId === selectedUser?._id) {
        useChatStore.setState((state) => ({
          chatHistory: state.chatHistory.map((m) =>
            m.status !== "read" ? { ...m, status: "read" } : m,
          ),
        }));
        resetUnreadMessages(receiverId);
      }
    });

    socket.on("messageDelivered", (senderId) => {
      const { selectedUser } = useChatStore.getState();
      if (senderId === selectedUser?._id) {
        useChatStore.setState((state) => ({
          chatHistory: state.chatHistory.map((m) =>
            m.status === "sent" ? { ...m, status: "delivered" } : m,
          ),
        }));
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useAuthStore;
