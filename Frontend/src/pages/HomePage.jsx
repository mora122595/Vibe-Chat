import { MessageCircle } from "lucide-react";
import useChatStore from "../stores/UseChatStore";
import { useEffect } from "react";
import SideBar from "../components/SideBar";
import ChatWindow from "../components/ChatWindow";

const HomePage = () => {
  const { fetchUsers, isFetchingUsers, selectedUser } = useChatStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex flex-col lg:flex-row lg:h-full p-6 gap-6">
      {/* Left - themes 1/4 */}
      <div className="flex-[1] overflow-y-auto order-1">
        {isFetchingUsers ? <p>Loading...</p> : <SideBar />}
      </div>
      {/* Right - themes 3/4  */}
      <div className="flex-[4] order-2 border-l border-base-300 px-4">
        {!selectedUser && (
          <div className="flex flex-col gap-6 justify-center items-center h-full">
            <div className="flex flex-row items-center justify-center gap-2 mb-4">
              <MessageCircle className="size-8 text-primary" />
              <p className="font-bold text-base">VibeChat</p>
            </div>
            <h1 className="text-2xl font-bold">Welcome to VibeChat</h1>
            <p className="mb-6 text-md">Select a Chat to start messaging</p>
          </div>
        )}
        {selectedUser && <ChatWindow />}
      </div>
    </div>
  );
};

export default HomePage;
