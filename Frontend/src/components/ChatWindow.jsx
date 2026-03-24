import useChatStore from "../stores/UseChatStore";
import useAuthStore from "../stores/UseAuthStore";
import { ImagePlus, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ChatWindow = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const { selectedUser, sendMessage, chatHistory, fetchChatHistory } =
    useChatStore();
  const [message, setMessage] = useState({
    text: "",
    image: "",
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]); // runs every time chatHistory updates

  useEffect(() => {
    if (!selectedUser._id) return;
    fetchChatHistory();
  }, [selectedUser._id, fetchChatHistory]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = async () => {
        try {
          setSendingMessage(true);
          const canvas = document.createElement("canvas");
          const maxSize = 200;

          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL("image/jpeg", 0.7);

          // ✅ Send image + existing text
          await sendMessage({
            text: message.text, // include typed text
            image: compressed,
          });

          // ✅ Clear message after sending
          setMessage({ text: "", image: "" });
        } catch (error) {
          console.error("Image send failed:", error);
        } finally {
          e.target.value = null;
          setSendingMessage(false);
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!message.text.trim() && !message.image) return;

    setSendingMessage(true);

    await sendMessage(message);

    setSendingMessage(false);

    setMessage({ text: "", image: "" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 pl-4">
        <img
          src={
            selectedUser.profilePicture ||
            `https://ui-avatars.com/api/?name=${selectedUser.fullname}&background=random`
          }
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
      <div className="divider px-4"></div>

      <div className="flex-1 overflow-y-auto p-4" id="scroll-container">
        {chatHistory.map((m) => (
          <div
            key={m._id}
            className={`chat ${m.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="avatar"
                  src={
                    m.senderId === authUser._id
                      ? authUser.profilePicture ||
                        `https://ui-avatars.com/api/?name=${authUser.fullname}&background=random`
                      : selectedUser.profilePicture ||
                        `https://ui-avatars.com/api/?name=${selectedUser.fullname}&background=random`
                  }
                />
              </div>
            </div>
            <div className="chat-bubble">
              {m.image && (
                <img
                  src={m.image}
                  alt="attachment"
                  className="max-w-xs rounded-lg mt-1 cursor-pointer pb-1"
                  onClick={() => window.open(m.image, "_blank")}
                />
              )}
              {m.text && <p>{m.text}</p>}
            </div>
            <p className="chat-footer text-xs opacity-50">
              {new Date(m.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="flex items-center gap-2 p-2 bg-base-300 rounded-xl">
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
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full input-sm"
          value={message.text}
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
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
