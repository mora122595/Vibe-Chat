import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  chatHistory: [],
  unreadMessages: {},
  isLoadingChatHistory: false,
  isFetchingUsers: false,
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
    set({ isLoadingChatHistory: true });
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.get(
        `message/conversation/${selectedUser._id}`,
      );
      set({ chatHistory: res.data });
    } catch (error) {
      console.error("Error in fetchChatHistory: ", error.message);
    } finally {
      set({ isLoadingChatHistory: false });
    }
  },
  setSelectedUser: (user) => {
    if (!user) {
      set({ chatHistory: [], selectedUser: null });
      return;
    }
    get().resetUnreadMessages(user._id);
    set({ chatHistory: [], selectedUser: user });
  },
  sendMessage: async (message) => {
    const { chatHistory, selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        message,
      );
      const newMessage = res.data;
      set({ chatHistory: [...chatHistory, newMessage] });
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
}));

export default useChatStore;
