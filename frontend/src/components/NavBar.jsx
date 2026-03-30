import {
  MessageCircle,
  Settings,
  CircleUser,
  LogOut,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/UseAuthStore";
import useChatStore from "../stores/UseChatStore";
import useFriendsStore from "../stores/UseFriendsStore";
import { useEffect } from "react";

const NavBar = () => {
  const { authUser, logout, isLogingOut } = useAuthStore();
  const { selectedUser } = useChatStore();
  const { friendRequests, fetchRequests } = useFriendsStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div
      className={`w-full shadow-md border-b border-base-300 py-4 px-6 flex items-center justify-between ${selectedUser ? "hidden lg:flex" : "flex"}`}
    >
      <div>
        <Link to="/" className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg">VibeChat</span>
        </Link>
      </div>
      <div className="flex items-center">
        <Link to="/users" className="relative">
          <button className="p-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
            <Users className="w-8 h-8 text-secondary" />
          </button>
          {friendRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
              {friendRequests.length}
            </span>
          )}
        </Link>
        <Link to="/settings">
          <button className="p-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
            <Settings className="w-8 h-8 text-secondary" />
          </button>
        </Link>
        {authUser && (
          <div>
            <Link to="/profile">
              <button className="p-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
                <CircleUser className="w-8 h-8 text-secondary" />
              </button>
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-base-200 transition-colors duration-200"
              onClick={logout}
              disabled={isLogingOut}
            >
              <LogOut className="w-8 h-8 text-secondary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
