import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { FiSmile, FiPaperclip, FiSend, FiX } from "react-icons/fi";

const ChatInput = ({ onSendMessage, onSendFile }) => {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (selectedFile) {
      onSendFile(selectedFile);
      setSelectedFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      onSendMessage(text);
      setText("");
    }
    setShowEmoji(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSend = text.trim().length > 0 || !!selectedFile;

  return (
    <div className="bg-[#0b0f1a] border-t border-white/5 shrink-0 relative">
      {/* File preview */}
      {previewUrl && (
        <div className="px-3 sm:px-4 pt-3 flex items-center gap-2">
          <img
            src={previewUrl}
            alt="preview"
            className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-lg border border-white/10"
          />
          <button onClick={clearFile} className="text-gray-400 hover:text-red-400 transition p-1">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3">
        {/* Emoji - hidden on very small screens */}
        <button
          onClick={() => setShowEmoji((v) => !v)}
          className="hidden xs:flex text-gray-400 hover:text-violet-400 transition p-1.5 rounded-lg hover:bg-white/5 shrink-0 sm:flex"
        >
          <FiSmile size={18} />
        </button>

        {/* Text input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="
            flex-1 min-w-0
            bg-[#161b2e] border border-white/5 rounded-xl
            px-3 sm:px-4 py-2 sm:py-2.5
            text-sm text-gray-100 placeholder-gray-600
            focus:outline-none focus:border-violet-600/50 focus:ring-1 focus:ring-violet-600/30
            transition
          "
        />

        {/* File attach */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          hidden
          id="chatMedia"
          onChange={handleFileChange}
        />
        <label
          htmlFor="chatMedia"
          className="text-gray-400 hover:text-violet-400 transition p-1.5 rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
        >
          <FiPaperclip size={18} />
        </label>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 sm:p-2.5 rounded-xl transition shrink-0"
        >
          <FiSend size={16} />
        </button>
      </div>

      {/* Emoji picker - responsive width */}
      {showEmoji && (
        <div className="absolute bottom-full left-1 sm:left-4 z-50 mb-1">
          <EmojiPicker
            onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
            theme="dark"
            height={280}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInput;