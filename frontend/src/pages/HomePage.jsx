import { MessageCircle } from "lucide-react";
import useChatStore from "../stores/UseChatStore";
import { useEffect } from "react";
import SideBar from "../components/SideBar";
import ChatWindow from "../components/ChatWindow";

const HomePage = () => {
  const { fetchUsers, isFetchingUsers, selectedUser, fetchUnreadCounts } =
    useChatStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUnreadCounts();
  }, []);

  return (
    <div className="flex h-full">
      {/* Left - Sidebar */}
      <div
        className={`flex-[1] overflow-y-auto ${
          selectedUser ? "hidden md:block" : "block w-full"
        }`}
      >
        {isFetchingUsers ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : (
          <SideBar />
        )}
      </div>

      {/* Right - Chat Window */}
      <div
        className={`flex-[4] ${
          !selectedUser ? "hidden md:block" : "block w-full"
        }`}
      >
        {!selectedUser && (
          <div className="hidden md:flex md:flex-col gap-6 justify-center items-center h-full">
            <div className="flex flex-row items-center justify-center gap-2 mb-4">
              <MessageCircle className="size-8 text-primary" />
              <p className="font-bold text-base">VibeChat</p>
            </div>
            <h1 className="text-2xl font-bold">Welcome to VibeChat</h1>
            <p className="mb-6 text-base text-base-content/70">
              Select a Chat to start messaging
            </p>
          </div>
        )}
        {selectedUser && <ChatWindow />}
      </div>
    </div>
  );
};

export default HomePage;
