import React from "react";
import useChatStore from "../stores/UseChatStore";
import { UsersRound } from "lucide-react";
import useAuthStore from "../stores/UseAuthStore";
import useFriendsStore from "../stores/UseFriendsStore";

const SideBar = () => {
  const { users, setSelectedUser, unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { friends, fetchFriends } = useFriendsStore();

  React.useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="flex flex-col  w-full pl-4 pr-4">
      <p className="flex items-center justify-start text-2xl font-bold gap-2 py-2 ">
        <UsersRound />
        Friends
      </p>
      <div className="divider"></div>
      {friends.length === 0 && <p>No users found</p>}
      {friends.map((friend) => (
        <div
          className="flex flex-row items-center justify-between hover:bg-base-200 hover:rounded-lg cursor-pointer transition-all w-full bg-base-100  pl-4 py-2"
          onClick={() => setSelectedUser(friend)}
          key={friend._id}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(friend._id) ? "online" : "offline"}`}
            >
              <div className="w-10 rounded-full">
                <img
                  alt="profilepic"
                  src={
                    friend.profilePicture ||
                    `https://ui-avatars.com/api/?name=${friend.fullname}&background=random`
                  }
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">{friend.fullname}</p>
              <p className="text-sm">
                {onlineUsers.includes(friend._id) ? "online" : "offline"}
              </p>
            </div>
          </div>
          {unreadMessages[friend._id] > 0 && (
            <div className="pr-4">
              <div className="badge badge-primary">
                {unreadMessages[friend._id]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideBar;
