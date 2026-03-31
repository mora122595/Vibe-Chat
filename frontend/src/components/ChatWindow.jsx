import useChatStore from "../stores/UseChatStore";
import useAuthStore from "../stores/UseAuthStore";
import { ImagePlus, Send, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getAvatar } from "../lib/helpers";
import ChatMessage from "./ChatMessage";

const ChatWindow = () => {
  const { onlineUsers, socket, authUser } = useAuthStore();
  const {
    selectedUser,
    sendMessage,
    chatHistory,
    fetchChatHistory,
    setSelectedUser,
    isTyping,
  } = useChatStore();

  const [message, setMessage] = useState({
    text: "",
    image: "",
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  const bgImage =
    "url(https://res.cloudinary.com/du5jeewxn/image/upload/v1774679183/cats_lvvcjj.jpg)";

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedUser._id) return;
    fetchChatHistory();
    // Auto-focus input when chat opens
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [selectedUser._id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        setSendingMessage(true);
        await sendMessage({
          text: message.text,
          image: reader.result,
        });
        setMessage({ text: "", image: "" });
      } catch (error) {
        console.error("Image send failed:", error);
      } finally {
        e.target.value = null;
        setSendingMessage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!message.text.trim() && !message.image) return;

    setSendingMessage(true);
    await sendMessage(message);
    setMessage({ text: "", image: "" });
    setSendingMessage(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleTyping = () => {
    if (!socket || !selectedUser?._id) return;

    // Emit typing immediately
    socket.emit("typing", selectedUser._id);

    // Reset timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit stopTyping after delay
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", selectedUser._id);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:static lg:h-full lg:flex lg:flex-col overflow-x-hidden">
      <div className="flex items-center gap-3 pl-4 py-4  border-base-300 border-shadow-xl bg-base-300 rounded-t-xl">
        <button onClick={() => setSelectedUser(null)} className="md:hidden">
          <ArrowLeft />
        </button>
        <img
          src={getAvatar(selectedUser)}
          className="w-10 h-10 rounded-full object-cover"
          alt="avatar"
        />
        <div className="flex flex-col">
          <p className="font-semibold">{selectedUser.fullname}</p>
          <p className="text-sm">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 min-h-0 bg-repeat relative"
        style={{
          backgroundImage: {
            bgImage,
          },
          backgroundSize: "300px",
        }}
      >
        <div className="absolute inset-0 bg-base-100/40"></div>

        <div className="relative h-full p-4 overflow-y-auto">
          {chatHistory.map((m) => (
            <div key={m._id}>
              <ChatMessage
                m={m}
                authUser={authUser}
                selectedUser={selectedUser}
              />
            </div>
          ))}
          {isTyping && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="avatar" src={getAvatar(selectedUser)} />
                </div>
              </div>
              <div className="chat-bubble bg-base-300">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-base-300 rounded-b-xl shrink-0">
        <label className="btn btn-neutral btn-sm btn-square cursor-pointer">
          <ImagePlus className="size-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profilePicture"
            onChange={handleImage}
            disabled={sendingMessage}
          />
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full input-sm"
          value={message.text}
          onChange={(e) => {
            setMessage((prev) => ({ ...prev, text: e.target.value }));
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={sendingMessage}
        />
        <button
          className="btn btn-primary btn-sm btn-circle"
          onClick={handleSendMessage}
          disabled={sendingMessage}
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
