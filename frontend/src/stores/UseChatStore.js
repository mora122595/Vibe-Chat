import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./UseAuthStore.js";

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  chatHistory: [],
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
    const { socket } = useAuthStore.getState();
    set({ isLoadingChatHistory: true });
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.get(
        `message/conversation/${selectedUser._id}`,
      );
      set({ chatHistory: res.data });
      if (socket.connected) {
        socket.off("newMessage");
        socket.on("newMessage", (message) => {
          set({ chatHistory: [...get().chatHistory, message] });
        });
      }
    } catch (error) {
      console.error("Error in fetchChatHistory: ", error.message);
    } finally {
      set({ isLoadingChatHistory: false });
    }
  },
  setSelectedUser: (user) => {
    set({ chatHistory: [], selectedUser: user });
    const { socket } = useAuthStore.getState();
    socket.off("newMessage");
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
}));

export default useChatStore;
