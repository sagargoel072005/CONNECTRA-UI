const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatBubble = ({ msg, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[80%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm
          ${isSender
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-[#1a1f35] text-gray-100 rounded-bl-sm border border-[#2d3555]"
          }`}
      >
        {!isSender && (
          <p className="text-[11px] font-semibold mb-1 text-violet-400">
            {msg.firstName} {msg.lastName}
          </p>
        )}

        {msg.text && <p className="leading-relaxed break-words">{msg.text}</p>}

        {msg.fileType?.startsWith("image/") && (
          <img
            src={msg.fileUrl}
            alt="media"
            className="rounded-xl mt-2 w-full max-w-[200px] sm:max-w-xs object-cover"
          />
        )}

        {msg.fileType?.startsWith("video/") && (
          <video controls className="rounded-xl mt-2 w-full max-w-[200px] sm:max-w-xs">
            <source src={msg.fileUrl} />
          </video>
        )}

        {msg.fileType?.startsWith("audio/") && (
          <audio controls className="mt-2 w-full max-w-[200px] sm:max-w-xs">
            <source src={msg.fileUrl} />
          </audio>
        )}

        <span className={`text-[10px] block mt-1 text-right ${isSender ? "text-violet-200/60" : "text-gray-500"}`}>
          {formatTime(msg.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
