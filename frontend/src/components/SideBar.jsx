import React from "react";
import useChatStore from "../stores/UseChatStore";
import { UsersRound } from "lucide-react";
import useAuthStore from "../stores/UseAuthStore";

const SideBar = () => {
  const { users, setSelectedUser, unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-between w-full pl-4 pr-4">
      <p className="flex items-center text-xl font-bold gap-2 py-2">
        <UsersRound />
        contacts
      </p>
      <div className="divider"></div>
      {users.length === 0 && <p>No users found</p>}
      {users.map((u) => (
        <div
          className="flex flex-row items-center justify-between hover:bg-base-200 hover:rounded-lg cursor-pointer transition-all w-full bg-base-100  pl-4 py-2"
          onClick={() => setSelectedUser(u)}
          key={u._id}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(u._id) ? "online" : "offline"}`}
            >
              <div className="w-10 rounded-full">
                <img
                  alt="profilepic"
                  src={
                    u.profilePicture ||
                    `https://ui-avatars.com/api/?name=${u.fullname}&background=random`
                  }
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">{u.fullname}</p>
              <p className="text-sm">
                {onlineUsers.includes(u._id) ? "online" : "offline"}
              </p>
            </div>
          </div>
          {unreadMessages[u._id] > 0 && (
            <div className="pr-4">
              <div className="badge badge-primary">{unreadMessages[u._id]}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideBar;
