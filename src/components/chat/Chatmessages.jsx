import ChatBubble from "./ChatBubble";

const ChatMessages = ({ messages, userId, messagesEndRef }) => {
  return (
    <div
      className="
        flex-1 overflow-y-auto
        px-3 sm:px-4 py-4 sm:py-5
        space-y-3
        bg-[#0d1117]
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
      "
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600 select-none">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs">Say hello </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <ChatBubble key={index} msg={msg} isSender={msg.senderId === userId} />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;