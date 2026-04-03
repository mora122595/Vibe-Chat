import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import useAuthStore from "./UseAuthStore.js";
import * as Sentry from "@sentry/react";

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  chatHistory: [],
  unreadMessages: {},
  isTyping: false,
  isLoadingChatHistory: false,
  isFetchingUsers: false,
  lastMessageTimestamp: null,

  fetchUsers: async () => {
    set({ isFetchingUsers: true });
    try {
      const res = await axiosInstance("/message/users");
      const data = res.data;
      set({ users: data });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      set({ isFetchingUsers: false });
    }
  },
  fetchChatHistory: async () => {
    if (get().isLoadingChatHistory) return;
    set({ isLoadingChatHistory: true });
    const { selectedUser } = get();
    const isFirstLoad = get().lastMessageTimestamp === null; // ✅
    try {
      const res = await axiosInstance.get(
        `message/conversation/${selectedUser._id}`,
        { params: { lastMessageTimestamp: get().lastMessageTimestamp } },
      );

      if (isFirstLoad) {
        set({ chatHistory: res.data.messages });
      } else {
        set({ chatHistory: [...res.data.messages, ...get().chatHistory] });
      }

      set({ lastMessageTimestamp: res.data.nextCursor });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      set({ isLoadingChatHistory: false });
    }
  },
  setSelectedUser: (user) => {
    const { socket } = useAuthStore.getState();
    if (!user) {
      set({
        chatHistory: [],
        selectedUser: null,
        lastMessageTimestamp: null,
      });
      return;
    }
    set({ isTyping: false });
    set({ chatHistory: [], selectedUser: user, lastMessageTimestamp: null });
    get().resetUnreadMessages(user._id);

    if (!socket) {
      return;
    }
    if (socket.connected && user?._id) {
      socket.emit("messageRead", user._id);
    }
  },
  sendMessage: async (message) => {
    const { selectedUser } = get();
    const { socket } = useAuthStore.getState();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        message,
      );
      const newMessage = res.data;

      set((state) => ({
        chatHistory: [...state.chatHistory, newMessage],
      }));

      if (!socket) {
        return;
      }

      if (socket && socket.connected && selectedUser?._id) {
        socket.emit("stopTyping", selectedUser._id);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  },
  incrementUnreadMessages: (receiverId) => {
    if (receiverId === get().selectedUser?._id) return;
    set({
      unreadMessages: {
        ...get().unreadMessages,
        [receiverId]: (get().unreadMessages[receiverId] || 0) + 1,
      },
    });
  },
  resetUnreadMessages: (receiverId) => {
    set({ unreadMessages: { ...get().unreadMessages, [receiverId]: 0 } });
  },

  fetchUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/message/unread");
      const unreadMap = res.data.reduce((acc, { friendId, unreadCount }) => {
        acc[friendId] = unreadCount;
        return acc;
      }, {});
      set({ unreadMessages: unreadMap });
    } catch (error) {
      Sentry.captureException(error);
    }
  },
}));

export default useChatStore;
