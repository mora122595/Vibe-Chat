import { getAvatar, formatTime } from "../lib/helpers";
import { Check, CheckCheck } from "lucide-react";
const ChatMessage = ({ m, authUser, selectedUser }) => (
  <div
    className={`chat ${m.senderId === authUser._id ? "chat-end" : "chat-start"}`}
  >
    <div className="chat-image avatar">
      <div className="w-10 rounded-full">
        <img
          alt="avatar"
          src={
            m.senderId === authUser._id
              ? getAvatar(authUser)
              : getAvatar(selectedUser)
          }
        />
      </div>
    </div>
    <div className="chat-bubble rounded-2xl max-w-[70%] break-words">
      {m.image && (
        <img
          src={m.image}
          alt="attachment"
          className="max-w-[200px] w-full rounded-lg mt-1 cursor-pointer pb-1 object-cover"
          onClick={() => window.open(m.image, "_blank")}
        />
      )}
      {m.text && <p className="break-words">{m.text}</p>}
    </div>
    <p className="flex flex-row gap-2 chat-footer font-semibold text-xs text-neutral">
      {formatTime(m.createdAt)}
      {m.senderId === authUser._id &&
        (m.status === "sent" ? (
          <Check className="text-neutral-950 size-4" strokeWidth={2.5} />
        ) : m.status === "delivered" ? (
          <CheckCheck className="text-neutral-950 size-4" strokeWidth={2.5} />
        ) : (
          <CheckCheck className="text-accent size-4" strokeWidth={2.5} />
        ))}
    </p>
  </div>
);

export default ChatMessage;
