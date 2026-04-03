import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import useAuthStore from "./UseAuthStore.js";

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
      console.error("Error in fetchUsers: ", error.message);
    } finally {
      set({ isFetchingUsers: false });
    }
  },

  fetchChatHistory: async () => {
    if (get().isLoadingChatHistory) return;
    console.log("fetchChatHistory called!", {
      lastMessageTimestamp: get().lastMessageTimestamp,
      chatHistoryLength: get().chatHistory.length,
    });
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
      console.error("Error in fetchChatHistory: ", error.message);
    } finally {
      set({ isLoadingChatHistory: false });
    }
  },
  setSelectedUser: (user) => {
    const { socket } = useAuthStore.getState();
    if (!user) {
      set({ chatHistory: [], selectedUser: null, lastMessageTimestamp: null });
      return;
    }
    set({ isTyping: false });
    set({ chatHistory: [], selectedUser: user, lastMessageTimestamp: null });

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

      // Use the functional update (state) => ({ ... })
      // to ensure Zustand triggers a re-render correctly
      set((state) => ({
        chatHistory: [...state.chatHistory, newMessage],
      }));

      console.log("Latest message added to Store:", newMessage);

      if (!socket) {
        return;
      }

      if (socket && socket.connected && selectedUser?._id) {
        socket.emit("stopTyping", selectedUser._id);
      }
    } catch (error) {
      console.error("Error in sendMessage: ", error.message);
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
      console.error("Error in fetchUnreadCounts: ", error.message);
    }
  },
}));

export default useChatStore;
