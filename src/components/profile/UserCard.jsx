import axios from "axios";
import { Heart, X, UserCircle } from "lucide-react";
import { BASE_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../../utils/feedSlice";

const UserCard = ({ user }) => {
  // 🔹 Destructure user data
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    location,
  } = user;

  const dispatch = useDispatch();

  // 🔹 Handle request (ignore / interested)
  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );

      // 🔹 Remove user from feed after action
      dispatch(removeFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="w-full max-w-80 h-[520px] rounded-3xl overflow-hidden flex flex-col
      bg-white/5 backdrop-blur-xl border border-white/10 
      shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      hover:scale-[1.02] transition duration-300"
    >
      {/* 🔹 User Image */}
      <div className="relative w-full h-80 rounded-t-3xl overflow-hidden">
        <img
          src={photoUrl || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />

        {/* 🔹 Gender Tag */}
        <span
          className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20 text-white
          shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        >
          {gender}
        </span>
      </div>

      {/* 🔹 Content */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between">

        {/* 🔹 User Info */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white flex justify-center items-center gap-2">
            <UserCircle size={20} /> {firstName} {lastName}
          </h2>

          <p className="text-sm text-white/60 mt-1">
            {age} years old {location ? `• ${location}` : ""}
          </p>

          <p className="text-sm text-white/70 mt-3 italic line-clamp-3">
            {about || "This user hasn't shared anything yet."}
          </p>
        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">

          {/* Ignore */}
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="px-4 py-2 text-sm rounded-full 
            border border-red-400/30 text-red-400 
            hover:bg-red-500/10 transition"
          >
            <X className="inline mr-1" size={16} /> Ignore
          </button>

          {/* Interested */}
          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="px-4 py-2 text-sm rounded-full 
            bg-gradient-to-r from-indigo-500 to-purple-500 
            text-white hover:scale-105 transition"
          >
            <Heart className="inline mr-1" size={16} /> Interested
          </button>

        </div>
      </div>
    </div>
  );
};

export default UserCard;