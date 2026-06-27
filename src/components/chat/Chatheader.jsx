import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";

const ChatHeader = ({ targetUser }) => {
  const navigate = useNavigate();

  const firstName = targetUser?.firstName ?? "";
  const lastName = targetUser?.lastName ?? "";
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : null;
  const initials = firstName?.[0] || lastName?.[0]
    ? `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-[#0b0f1a] border-b border-white/5 shrink-0">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition shrink-0"
      >
        <FiArrowLeft size={18} />
      </button>

      {/* Avatar */}
      <div className="relative shrink-0">
        {targetUser?.photoUrl ? (
          <img
            src={targetUser.photoUrl}
            alt={fullName ?? "User"}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0b0f1a]" />
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight truncate">
          {fullName ?? "Loading..."}
        </p>
        
      </div>

      <button className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition shrink-0">
        <FiMoreVertical size={18} />
      </button>
    </header>
  );
};

export default ChatHeader;