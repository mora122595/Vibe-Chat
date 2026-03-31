import {
  UserRoundSearch,
  MessageCircle,
  Trash2,
  Hourglass,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import useChatStore from "../stores/UseChatStore";
import useFriendsStore from "../stores/UseFriendsStore";
import UserCard from "./UserCard";

const SearchBar = ({ onSendMessage, onRemoveFriend }) => {
  const { users } = useChatStore();
  const { friends, sendRequest, pendingRequests, removeRequest } =
    useFriendsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const friendsIds = useMemo(
    () => new Set(friends.map((f) => f._id)),
    [friends],
  );
  const pendingRequestsIds = useMemo(
    () => new Set(pendingRequests.map((req) => req._id)),
    [pendingRequests],
  );

  const isSearching = debouncedQuery.trim().length > 0;

  const filteredUsers = isSearching
    ? users
        .filter(
          (u) =>
            u.fullname.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
        .sort((a, b) => {
          const aIsFriend = friendsIds.has(a._id);
          const bIsFriend = friendsIds.has(b._id);
          const aIsPending = pendingRequestsIds.has(a._id);
          const bIsPending = pendingRequestsIds.has(b._id);

          if (aIsFriend && !bIsFriend) return -1;
          if (!aIsFriend && bIsFriend) return 1;
          if (aIsPending && !bIsPending) return -1;
          if (!aIsPending && bIsPending) return 1;
          return 0;
        })
    : [];

  return (
    <div className="w-full">
      <div className="form-control pb-1 relative">
        <div className="relative">
          <UserRoundSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-full pl-10 rounded-xl shadow-sm focus:shadow-md transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        {isSearching && filteredUsers.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-base-100 border border-base-300 rounded-xl shadow-lg z-50">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="flex justify-between py-3 px-4 items-center hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0"
              >
                <UserCard user={u} />
                <div className="flex items-center gap-2">
                  {friendsIds.has(u._id) ? (
                    <>
                      <button
                        className="btn btn-secondary btn-sm hover:scale-105 active:scale-95 transition"
                        onClick={() => onSendMessage(u)}
                      >
                        <MessageCircle className="size-5 text-primary font-bold" />
                        Message
                      </button>
                      <button
                        className="btn btn-ghost btn-sm hover:scale-105 hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition"
                        onClick={() => onRemoveFriend(u)}
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </>
                  ) : pendingRequestsIds.has(u._id) ? (
                    <>
                      <button className="btn btn-warning btn-sm pointer-events-none cursor-not-allowed">
                        <Hourglass className="size-5 text-secondary font-bold" />
                        Pending
                      </button>
                      <button
                        className="btn btn-ghost btn-sm hover:scale-105 hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition"
                        onClick={() => removeRequest(u._id)}
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm hover:scale-105 active:scale-95 transition"
                      onClick={() => sendRequest(u._id)}
                    >
                      + Add Friend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isSearching && filteredUsers.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-base-100 border border-base-300 rounded-xl shadow-lg z-50">
            <p className="text-center text-base-content/60">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
