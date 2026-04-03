import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import * as Sentry from "@sentry/react";

export const useFriendsStore = create((set, get) => ({
  friends: [],
  friendRequests: [],
  pendingRequests: [],
  isFetchingFriends: false,
  isFetchingRequests: false,
  isSendingRequest: false,

  fetchFriends: async () => {
    set({ isFetchingFriends: true });
    try {
      const res = await axiosInstance.get("/friends/list");
      set({ friends: res.data.friends });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      set({ isFetchingFriends: false });
    }
  },
  fetchRequests: async () => {
    set({ isFetchingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ friendRequests: res.data.friendRequests });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      set({ isFetchingRequests: false });
    }
  },

  fetchPendingRequests: async () => {
    set({ isFetchingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/pending-requests");
      set({ pendingRequests: res.data.pendingRequests });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      set({ isFetchingRequests: false });
    }
  },

  sendRequest: async (userId) => {
    set({ isSendingRequest: true });
    try {
      const res = await axiosInstance.post(`/friends/request/${userId}`);
      get().fetchPendingRequests();
      toast.success(res.data.message);
    } catch (error) {
      Sentry.captureException(error);
      toast.error("could not send friend Request");
    } finally {
      set({ isSendingRequest: false });
    }
  },

  acceptRequest: async (userId) => {
    try {
      const res = await axiosInstance.patch(`/friends/accept/${userId}`);
      await get().fetchFriends();
      await get().fetchRequests();
      toast.success(res.data.message);
    } catch (error) {
      Sentry.captureException(error);
    }
  },

  declineRequest: async (userId) => {
    try {
      const res = await axiosInstance.patch(`/friends/decline/${userId}`);
      await get().fetchRequests();
      toast.success("Friend request declined");
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not decline request");
      Sentry.captureException(error);
    }
  },

  removeFriend: async (userId) => {
    try {
      const res = await axiosInstance.delete(`/friends/unfriend/${userId}`);
      set({ friends: get().friends.filter((f) => f._id !== userId) });
      toast.success("user removed from friend list");
    } catch (error) {
      Sentry.captureException(error);
    }
  },

  removeRequest: async (userId) => {
    try {
      const res = await axiosInstance.delete(
        `/friends/remove-request/${userId}`,
      );
      set({
        pendingRequests: get().pendingRequests.filter((f) => f._id !== userId),
      });
      toast.success("Friend request removed successfully");
    } catch (error) {
      Sentry.captureException(error);
    }
  },
}));

export default useFriendsStore;
