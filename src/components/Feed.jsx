import { useDispatch, useSelector } from 'react-redux';
import { addFeed, removeFeed } from "../utils/feedSlice"; // ✅ CHANGED: Import removeFeed
import { useEffect, useState } from "react";
import UserCard from "./profile/UserCard";
import axios from "axios";
import { BASE_URL } from '../utils/constants';
import {
  UserRound,
  Users,
  Gem,
  UserPlus2,
  LogOut,
  Video,
  Newspaper
} from "lucide-react";

import { Link } from "react-router-dom";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ CHANGED: State to manage animations
  const [animation, setAnimation] = useState({ id: null, type: '' });

  const getFeed = async () => {
    try {
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(response.data);
     dispatch(addFeed(response.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Only fetch feed if it's not already populated
    if (!feed) {
      getFeed();
    }
  }, [feed]); // ✅ CHANGED: Dependency array

  // ✅ CHANGED: Handle actions from the card
const handleAction = async (status, userId) => {
  try {
    // 1️⃣ Trigger animation
    setAnimation({
      id: userId,
      type: status === "ignored" ? "swipe-left" : "swipe-right",
    });

    // 2️⃣ Call backend
    await axios.post(
      BASE_URL + "/request/send/" + status + "/" + userId,
      {},
      { withCredentials: true }
    );

    // 3️⃣ Remove after animation
    setTimeout(() => {
      dispatch(removeFeed(userId));
      setAnimation({ id: null, type: "" });
    }, 300);

  } catch (err) {
    console.error(err);
  }
};

  if (!feed) return <div className="text-center mt-20">Loading feed...</div>; // Improved loading state

  const filteredFeed = (feed || []).filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  return (
    <div className="flex w-full min-h-screen bg-gray-100 overflow-hidden">
     
      <div className="hidden md:flex flex-col items-center gap-6 p-4 w-[80px] bg-white shadow-md border-r">
        <Link to="/profile"><UserRound className="text-blue-500" /></Link>
        <Link to="/user/connections"><Users className="text-blue-500" /></Link>
        <Link to="/requests"><UserPlus2 className="text-blue-500" /></Link>
        <Link to="/video-login"><Video className="text-blue-500" /></Link>
        <Link to="/premium"><Gem className="text-blue-500" /></Link>
        <Link to="/tech-news"><Newspaper className="text-blue-600" /></Link>
        <Link to="/login"><LogOut className="text-blue-500" /></Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gray-50 overflow-hidden px-4 py-6">
        {/* Search */}
        <div className="w-full max-w-md mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Feed Display */}
        {filteredFeed.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">
            No users found for &quot;{searchTerm}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {filteredFeed.slice(0, 15).map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onAction={(status) => handleAction(user._id, status)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;