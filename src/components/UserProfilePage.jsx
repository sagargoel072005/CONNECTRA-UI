import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const UserProfilePage = () => {
  const { userId } = useParams();
  const currentUser = useSelector((store) => store.user);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/${userId}`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleToggleLike = async (postId) => {
    try {
      await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, { withCredentials: true });
      fetchUserProfile();
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentTexts[postId];
    if (!text || text.trim() === "") return;
    try {
      await axios.post(
        `${BASE_URL}/posts/${postId}/comment`,
        { text },
        { withCredentials: true }
      );
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      fetchUserProfile();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const getMediaUrl = (mediaUrl) => {
    if (!mediaUrl) return "";
    if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
      return mediaUrl;
    }
    return `${BASE_URL}${mediaUrl}`;
  };

  const Starfield = () => (
    <div
      className="pointer-events-none fixed inset-0 opacity-60"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    />
  );

  if (loading)
    return (
      <div className="relative flex justify-center items-center min-h-screen bg-[#08070d] overflow-hidden">
        <Starfield />
        <p className="relative text-slate-400 text-lg font-semibold">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="relative flex justify-center items-center min-h-screen bg-[#08070d] overflow-hidden">
        <Starfield />
        <p className="relative text-rose-400 text-lg font-semibold">User not found</p>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08070d]">
      <Starfield />
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-700/[0.07] blur-3xl" />

      <div className="relative max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-10 rounded-2xl border border-white/10"
        >
          <img
            src={
              user.photoUrl ||
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=128`
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-violet-500/30 shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-violet-400 font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              @{user.firstName.toLowerCase() + user.lastName.toLowerCase()}
            </p>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto sm:mx-0">
              {user.about || "This user hasn't added a bio yet."}
            </p>
          </div>
        </motion.div>

        {/* Posts Section */}
        <section className="mt-10 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-white border-b border-white/10 pb-3">
            Posts
          </h2>

          {posts.length === 0 ? (
            <p className="text-slate-500 text-center py-16 sm:py-24 text-base sm:text-lg font-medium">
              No posts yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {posts.map((post, index) => {
                const liked = post.likes.some(
                  (u) =>
                    (typeof u === "string" && u === currentUser._id) ||
                    (u && typeof u === "object" && u._id === currentUser._id)
                );
                return (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.05] transition-colors duration-300 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                  >
                    {post.mediaUrl && (
                      <img
                        src={getMediaUrl(post.mediaUrl)}
                        alt="Post media"
                        className="object-cover w-full h-48 sm:h-52 hover:scale-[1.02] transition-transform duration-300"
                      />
                    )}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      {post.caption && (
                        <p className="text-slate-200 text-sm sm:text-base mb-3 flex-grow whitespace-pre-wrap">
                          {post.caption}
                        </p>
                      )}

                      {/* Like and Comment buttons */}
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => handleToggleLike(post._id)}
                          className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-200 ${
                            liked
                              ? "text-rose-400 bg-rose-500/10"
                              : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          }`}
                        >
                          <Heart
                            className="h-5 w-5 sm:h-6 sm:w-6"
                            fill={liked ? "currentColor" : "none"}
                            strokeWidth={2}
                          />
                          <span className="font-medium text-sm sm:text-base">{post.likes.length}</span>
                        </button>
                        <span className="text-slate-500 font-medium text-sm sm:text-base">
                          {post.comments.length} comments
                        </span>
                      </div>

                      {/* Render comments */}
                      {post.comments.length > 0 && (
                        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto border-t border-white/10 pt-2">
                          {post.comments.map((c) => (
                            <div key={c._id} className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-violet-500/20 rounded-full flex-shrink-0"></div>
                              <p className="text-sm text-slate-300 leading-snug">
                                <span className="font-semibold text-slate-200">
                                  {c.user?.firstName || "User"}:
                                </span>{" "}
                                {c.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment input */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(post._id);
                        }}
                        className="flex items-center gap-2 mt-4"
                      >
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentTexts[post._id] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          className="flex-grow p-2 bg-white/[0.04] border border-white/10 rounded-full text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
                        />
                        <button
                          type="submit"
                          disabled={!commentTexts[post._id] || commentTexts[post._id].trim() === ""}
                          className="p-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 transition-colors duration-200 shrink-0"
                        >
                          <Send className="h-4 w-4 rotate-90" />
                        </button>
                      </form>

                      <time className="text-slate-500 text-xs sm:text-sm mt-3">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <Link
          to="/connections"
          className="inline-flex items-center mt-10 sm:mt-16 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-violet-600/30 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Connections
        </Link>
      </div>
    </div>
  );
};

export default UserProfilePage;