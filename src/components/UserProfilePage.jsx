import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { useSelector } from "react-redux";

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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-semibold">
        Loading profile...
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg font-semibold">
        User not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <img
          src={
            user.photoUrl ||
            `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=128`
          }
          alt={`${user.firstName} ${user.lastName}`}
          className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-blue-600 font-semibold mb-4 text-lg">
            @{user.firstName.toLowerCase() + user.lastName.toLowerCase()}
          </p>
          <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto sm:mx-0">
            {user.about || "This user hasn't added a bio yet."}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-10 border-b border-gray-300 pb-3">
          Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-24 text-lg font-medium">
            No posts yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const liked = post.likes.some(
                (u) =>
                  (typeof u === "string" && u === currentUser._id) ||
                  (u && typeof u === "object" && u._id === currentUser._id)
              );
              return (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col"
                >
                  {post.mediaUrl && (
                    <img
                      src={getMediaUrl(post.mediaUrl)}
                      alt="Post media"
                      className="object-cover w-full h-52 hover:scale-[1.02] transition-transform duration-300"
                    />
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    {post.caption && (
                      <p className="text-gray-800 text-base mb-3 flex-grow whitespace-pre-wrap">
                        {post.caption}
                      </p>
                    )}

                    {/* Like and Comment buttons */}
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => handleToggleLike(post._id)}
                        className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-200 ${
                          liked ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Heart
                          className="h-6 w-6"
                          fill={liked ? "currentColor" : "none"}
                          strokeWidth={2}
                        />
                        <span className="font-medium">{post.likes.length}</span>
                      </button>
                      <span className="text-gray-500 font-medium">
                        {post.comments.length} comments
                      </span>
                    </div>

                    {/* Render comments */}
                    {post.comments.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-32 overflow-y-auto border-t border-gray-100 pt-2">
                        {post.comments.map((c) => (
                          <div key={c._id} className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex-shrink-0"></div>
                            <p className="text-sm text-gray-700 leading-snug">
                              <span className="font-semibold">
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
                        className="flex-grow p-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!commentTexts[post._id] || commentTexts[post._id].trim() === ""}
                        className="p-2 bg-blue-600 text-white rounded-full disabled:bg-gray-300 hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Send className="h-4 w-4 rotate-90" />
                      </button>
                    </form>

                    <time className="text-gray-400 text-sm mt-3">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Link
        to="/connections"
        className="inline-flex items-center mt-16 px-5 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Connections
      </Link>
    </div>
  );
};

export default UserProfilePage;