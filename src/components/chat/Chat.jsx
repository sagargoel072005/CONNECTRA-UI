import { useParams } from "react-router-dom";
import { useChat } from "../../utils/useChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = () => {
  const { targetUserId } = useParams();
  const { messages, userId, targetUser, messagesEndRef, sendMessage, sendFile } =
    useChat(targetUserId);

  return (
    // min-h-screen + bg on outer div ensures no white flash from parent
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-0 sm:px-4 py-0 sm:py-6">
      <div
        className="
          w-full sm:max-w-2xl lg:max-w-3xl
          flex flex-col
          h-screen sm:h-[88vh]
          sm:rounded-2xl overflow-hidden
          border-0 sm:border sm:border-white/5
          sm:shadow-2xl sm:shadow-black/60
          bg-[#0d1117]
          relative
        "
      >
        <ChatHeader targetUser={targetUser} />
        <ChatMessages
          messages={messages}
          userId={userId}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput onSendMessage={sendMessage} onSendFile={sendFile} />
      </div>
    </div>
  );
};

export default Chat;