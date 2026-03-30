import {
  UserRoundSearch,
  MessageCircle,
  Trash2,
  AlertTriangle,
  Contact,
  UserRoundPlus,
  CircleQuestionMark,
  Clock,
  Hourglass,
} from "lucide-react";
import useFriendsStore from "../stores/UseFriendsStore";
import useChatStore from "../stores/UseChatStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import SearchBar from "../components/SearchBar";

const UsersPage = () => {
  const navigate = useNavigate();

  const {
    fetchFriends,
    fetchRequests,
    friendRequests,
    friends,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    fetchPendingRequests,
    pendingRequests,
    removeRequest,
  } = useFriendsStore();

  const { users, fetchUsers, setSelectedUser } = useChatStore();

  const friendIds = new Set(friends.map((f) => f._id));
  const pendingRequestsIds = new Set(pendingRequests.map((req) => req._id));
  const nonFriends = users.filter((u) => !friendIds.has(u._id));

  const [randomUsers, setRandomUsers] = useState([]);

  useEffect(() => {
    if (nonFriends.length === 0) {
      setRandomUsers([]);
      return;
    }

    const shuffled = [...nonFriends];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRandomUsers(shuffled.slice(0, 8));
  }, [nonFriends.length]);

  useEffect(() => {
    fetchRequests();
    fetchFriends();
    fetchUsers();
    fetchPendingRequests();
  }, [fetchRequests, fetchFriends, fetchUsers, fetchPendingRequests]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const isSearching = debouncedQuery.trim().length >= 1;

  const filteredUsers = isSearching
    ? users.filter(
        (u) =>
          u.fullname.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : [];

  const handleRemoveFriend = (friend) => {
    toast(
      (t) => (
        <span className="flex flex-col border-l-2 justify-center items-center gap-4 p-2 pl-4">
          <span>
            Remove <span className="font-bold">{friend.fullname}</span> from
            friends?{" "}
          </span>
          <div className="flex flex-row gap-4">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="btn btn-neutral btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                removeFriend(friend._id);
              }}
              className="btn btn-error btn-sm"
            >
              Remove
            </button>
          </div>
        </span>
      ),
      {
        duration: 10000,
        position: "top-center",
        icon: <AlertTriangle className="size-8 text-orange-500" />,
      },
    );
  };

  const handleSendMessage = async (user) => {
    setSelectedUser(user);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="max-w-screen-lg w-full px-4 py-6 bg-gradient-to-b from-base-200 to-base-100">
        <div className="flex flex-col items-center justify-center gap-6 pb-6">
          <div className="flex flex-col text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Find your friends
            </h1>

            <p className="text-base-content/70 max-w-md">
              Connect with others and expand your network
            </p>
          </div>
          <div className="w-full max-w-lg">
            <SearchBar
              onSendMessage={handleSendMessage}
              onRemoveFriend={handleRemoveFriend}
            />
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex gap-4 justify-between pb-4">
          <div className="flex items-center gap-2">
            <CircleQuestionMark className="size-5 text-primary" />
            <p className="font-bold text-lg">Friend Requests</p>
          </div>
          <p className="badge badge-primary">
            {friendRequests.length} requests
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {friendRequests.length === 0 && (
            <p className="text-center text-base-content/60 py-6">
              No pending friend requests
            </p>
          )}
          {friendRequests.map((u) => (
            <div
              key={u._id}
              className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-all pl-4"
            >
              <div className="flex justify-between py-4 items-center">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="size-12 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
                      <img
                        alt="profilepic"
                        src={
                          u.profilePic ||
                          `https://ui-avatars.com/api/?name=${u.fullname}&background=random`
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold">{u.fullname}</p>
                    <p className="text-sm">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 pr-4">
                  <button
                    className="btn btn-primary btn-xs md:btn-sm w-fit"
                    onClick={() => acceptRequest(u._id)}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-neutral btn-xs md:btn-sm w-fit"
                    onClick={() => declineRequest(u._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="divider"></div>
        <div className="flex gap-4 justify-between mx-auto pb-4">
          <div className="flex items-center gap-2">
            <UserRoundPlus className="size-5 text-primary" />
            <p className="font-bold text-lg">People you may know</p>
          </div>
        </div>
        <div className="grid  grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          {randomUsers.length === 0 && (
            <p className="text-center text-base-content/60 py-6">
              no friend suggestions
            </p>
          )}
          {randomUsers.map((u) => (
            <div
              key={u._id}
              className="card bg-base-100 border border-base-300 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 py-4"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="avatar pb-1">
                  <div className="size-12 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
                    <img
                      alt="profilepic"
                      src={
                        u.profilePic ||
                        `https://ui-avatars.com/api/?name=${u.fullname}&background=random`
                      }
                    />
                  </div>
                </div>
                <p className="font-bold">{u.fullname}</p>
                <p className="text-sm pb-4">{u.email}</p>
                {pendingRequestsIds.has(u._id) && (
                  <button className="btn btn-warning btn-sm pointer-events-none cursor-not-allowed">
                    <Hourglass className="size-5 text-secondary font-bold" />
                    Pending
                  </button>
                )}
                {!pendingRequestsIds.has(u._id) && (
                  <button
                    className="btn btn-primary btn-sm w-2/3 h-10"
                    onClick={() => sendRequest(u._id)}
                  >
                    + Add Friend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="divider"></div>
        <div className="flex gap-4 justify-between mx-auto pb-4">
          <div className="flex items-center gap-2">
            <Contact className="size-5 text-primary" />
            <p className="font-bold text-lg">Friends</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {friends.length === 0 && (
            <p className="text-center text-base-content/60 py-6">
              Add some friends to see them here
            </p>
          )}
          {friends.map((u) => (
            <div
              key={u._id}
              className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-all pl-4"
            >
              <div className="flex justify-between py-3 items-center">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="size-12 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
                      <img
                        alt="profilepic"
                        src={
                          u.profilePic ||
                          `https://ui-avatars.com/api/?name=${u.fullname}&background=random`
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold">{u.fullname}</p>
                    <p className="text-sm">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-4">
                  <button
                    className="btn btn-secondary   btn-sm hover:scale-105 active:scale-95 transition"
                    onClick={() => handleSendMessage(u)}
                  >
                    <MessageCircle className="size-5 text-primary font-bold" />
                    Message
                  </button>
                  <button
                    className="btn btn-ghost btn-sm hover:scale-105 hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition tooltip tooltip-right"
                    data-tip="Remove friend"
                    onClick={() => handleRemoveFriend(u)}
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="divider"></div>
        <div className="flex gap-4 justify-between mx-auto pb-4">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <p className="font-bold text-lg">Pending Requests</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {pendingRequests.length === 0 && (
            <p className="text-center text-base-content/60 py-6">
              No current pending requests
            </p>
          )}
          {pendingRequests.map((u) => (
            <div
              key={u._id}
              className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-all pl-4"
            >
              <div className="flex justify-between py-3 items-center">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="size-12 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
                      <img
                        alt="profilepic"
                        src={
                          u.profilePic ||
                          `https://ui-avatars.com/api/?name=${u.fullname}&background=random`
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold">{u.fullname}</p>
                    <p className="text-sm">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-4">
                  <button className="btn btn-warning btn-sm pointer-events-none cursor-not-allowed">
                    <Hourglass className="size-5 text-secondary font-bold" />
                    Pending
                  </button>
                  <button
                    className="btn btn-ghost btn-sm hover:scale-105 hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition tooltip tooltip-right"
                    data-tip="Delete request"
                    onClick={() => removeRequest(u._id)}
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
