import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const {
          senderId,
          text,
          createdAt,
          fileUrl,
          fileType,
        } = msg;
        return {
          senderId: senderId?._id,
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          createdAt,
          fileUrl,
          fileType,
        };
      });

      setMessages(chatMessages);
      setTimeout(() => {
        scrollToBottom("auto");
      }, 100);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchChatMessages();
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on(
      "messageReceived",
      ({ senderId, firstName, lastName, text, fileUrl, fileType, }) => {
        setMessages((prev) => [
          ...prev,
          {
            senderId,
            firstName,
            lastName,
            text,
            fileUrl,
            fileType,
            createdAt: new Date().toISOString(),
          },

        ]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);


  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      senderId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageObj]);

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };


  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${BASE_URL}/chat/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { fileUrl, fileType } = res.data;

      setMessages((prev) => [
        ...prev,
        {
          senderId: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          text: "",
          fileUrl,
          fileType,
          createdAt: new Date().toISOString(),
        },
      ]);

      socketRef.current.emit("sendMessage", {
        firstName: user.firstName,
        lastName: user.lastName,
        userId,
        targetUserId,
        text: "",
        fileUrl,
        fileType,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto border border-gray-200 rounded-md my-6 flex flex-col h-[80vh] bg-white text-gray-800 shadow-lg">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 text-lg font-bold text-blue-600">
        💬 CodeConnect Chat
      </header>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100"
      >
        {messages.map((msg, index) => {
          const isSender = msg.senderId === userId;

          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[70%] px-4 py-2 rounded-2xl shadow ${isSender
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                  }`}
              >
                {!isSender && (
                  <p className="text-xs font-semibold mb-1 text-gray-600">
                    {msg.firstName} {msg.lastName}
                  </p>
                )}
                {msg.text && <p>{msg.text}</p>}
                {msg.fileType?.startsWith("image/") && (
                  <img
                    src={msg.fileUrl}
                    alt="chat-media"
                    className="rounded-lg mt-2 max-w-xs"
                  />
                )}

                {msg.fileType?.startsWith("video/") && (
                  <video
                    controls
                    className="rounded-lg mt-2 max-w-xs"
                  >
                    <source src={msg.fileUrl} />
                  </video>
                )}

                {msg.fileType?.startsWith("audio/") && (
                  <audio controls className="mt-2 w-full">
                    <source src={msg.fileUrl} />
                  </audio>
                )}
                <span className="text-[10px] opacity-70 block mt-1 text-right">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3 bg-white relative">
        {/* Emoji toggle */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-600 hover:text-blue-600"
        >
          <FaSmile size={22} />
        </button>

        {/* Text input */}
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
          className="flex-1 rounded-full bg-gray-100 border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {previewUrl && (
  <div className="p-2 border-t bg-gray-50">
    <img
      src={previewUrl}
      alt="preview"
      className="h-24 rounded-lg"
    />

    <button
      onClick={() => {
        setSelectedFile(null);
        setPreviewUrl("");
      }}
      className="ml-2 text-red-500"
    >
      ❌
    </button>
  </div>
)}
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          hidden
          id="chatMedia"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
          }}
        />

        <label
          htmlFor="chatMedia"
          className="cursor-pointer text-xl"
        >
          📎
        </label>
        <button
          onClick={() => {
  if (selectedFile) {
    handleFileUpload(selectedFile);

    setSelectedFile(null);
    setPreviewUrl("");
  } else {
    sendMessage();
  }
}}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-50">
            <EmojiPicker
              onEmojiClick={(emoji) =>
                setNewMessage((prev) => prev + emoji.emoji)
              }
              theme="light"
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;