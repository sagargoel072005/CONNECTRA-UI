import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Heart, Send, Image as ImageIcon, Trash2 } from "lucide-react";
import { BASE_URL } from "../../utils/constants";

const PostEdit = () => {
    const user = useSelector((store) => store.user);
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState(null);
    const [posts, setPosts] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [showComments, setShowComments] = useState({});

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/posts/user/${user._id}`, {
                withCredentials: true,
            });
            console.log(res.data);
            setPosts(res.data);


        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };

    useEffect(() => {
        if (user && user._id) {
            fetchPosts();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption && !media) {
            alert("Add caption or media");
            return;
        }
        const formData = new FormData();
        formData.append("caption", caption);
        if (media) formData.append("media", media);
        try {
            await axios.post(`${BASE_URL}/posts`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            setCaption("");
            setMedia(null);
            fetchPosts();
        } catch (err) {
            console.error("Failed to create post", err);
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, { withCredentials: true });
            fetchPosts();
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
            fetchPosts();
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`${BASE_URL}/posts/${postId}`, { withCredentials: true });
            fetchPosts();
        } catch (err) {
            console.error("Failed to delete post", err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 border-b pb-3 text-gray-800">Create Post</h2>

            <form
                onSubmit={handleSubmit}
                className="mb-10 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
                <textarea
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none mb-5 focus:ring-4 focus:ring-blue-400 focus:outline-none transition"
                    rows={4}
                />
                <label
                    htmlFor="media-upload"
                    className="inline-flex items-center gap-3 cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-5 select-none"
                    title="Add photo or video"
                >
                    <ImageIcon className="h-7 w-7" />
                    <span className="text-lg">{media ? media.name : "Add photo or video"}</span>
                </label>
                <input
                    id="media-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files[0])}
                    className="hidden"
                />

                <button
                    type="submit"
                    disabled={!caption && !media}
                    className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${!caption && !media
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    Post
                </button>
            </form>

            <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-gray-800">Your Posts</h2>

            {posts.length === 0 && (
                <p className="text-gray-500 text-center text-lg mt-10">
                    No posts yet.
                </p>
            )}

            {posts.map((post) => {
                const liked = post.likes.some((u) => u === user._id || u._id === user._id);
                const expanded = showComments[post._id] || false;
                const commentsToShow = expanded ? post.comments : post.comments.slice(0, 3);
                const isOwner = post.user._id === user._id || post.user === user._id;

                return (
                    <article
                        key={post._id}
                        className="mb-10 bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                    >
                        {/* Post Header */}
                        <header className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                                    <img
                                        src={
                                            post.user.profilePicture ||
                                            `https://ui-avatars.com/api/?name=${post.user.firstName}+${post.user.lastName}`
                                        }
                                        alt={`${post.user.firstName} ${post.user.lastName}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {post.user.firstName} {post.user.lastName}
                                    </h3>
                                    <time className="text-sm text-gray-500">{formatDate(post.createdAt)}</time>
                                </div>
                            </div>

                            {/* Delete button */}
                            {isOwner && (
                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                                    title="Delete post"
                                    aria-label="Delete post"
                                >
                                    <Trash2 className="h-6 w-6" />
                                </button>
                            )}
                        </header>

                        {/* Post Body */}
                        <div className="p-6">
                            {post.caption && (
                                <p className="mb-6 text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
                                    {post.caption}
                                </p>
                            )}

                            {post.mediaUrl && (
                                /\.(mp4|mov|mkv)$/i.test(post.mediaUrl) ? (
                                    <video controls style={{ maxWidth: "100%" }}>
                                        <source src={post.mediaUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={post.mediaUrl}
                                        alt="Post media"
                                        style={{ maxWidth: "100%" }}
                                    />
                                )
                            )}


                            {/* Like and Comment Buttons */}
                            <div className="flex items-center gap-6 mb-6 text-gray-600">
                                <button
                                    onClick={() => handleToggleLike(post._id)}
                                    className={`flex items-center gap-2 transition-colors duration-200 focus:outline-none ${liked ? "text-red-600" : "hover:text-red-600"
                                        }`}
                                    aria-label={liked ? "Unlike post" : "Like post"}
                                >
                                    <Heart
                                        className="h-7 w-7"
                                        fill={liked ? "currentColor" : "none"}
                                        strokeWidth={2}
                                    />
                                    <span className="font-semibold text-lg">{post.likes.length}</span>
                                </button>

                                <button
                                    onClick={() =>
                                        setShowComments((prev) => ({
                                            ...prev,
                                            [post._id]: !expanded,
                                        }))
                                    }
                                    className="text-lg font-semibold hover:text-blue-600 focus:outline-none transition-colors duration-200"
                                    aria-expanded={expanded}
                                >
                                    Comments ({post.comments.length})
                                </button>
                            </div>

                            {/* Comments Section */}
                            <section className="border-t border-gray-200 pt-4">
                                {post.comments.length === 0 && (
                                    <p className="text-gray-500 italic mb-3">No comments yet.</p>
                                )}
                                <ul
                                    className="mb-4 max-h-52 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200"
                                // If you want custom class instead of Tailwind plugin: add className="comment-scrollbar" and add CSS below
                                >
                                    {commentsToShow.map((comment) => (
                                        <li key={comment._id} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                                                <img
                                                    src={
                                                        comment.user.profilePicture ||
                                                        `https://ui-avatars.com/api/?name=${comment.user.firstName}+${comment.user.lastName}`
                                                    }
                                                    alt={`${comment.user.firstName} ${comment.user.lastName}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">
                                                    <strong>
                                                        {comment.user.firstName} {comment.user.lastName}
                                                    </strong>{" "}
                                                    <span className="text-gray-700">{comment.text}</span>
                                                </p>
                                                <time className="text-xs text-gray-400">{formatDate(comment.createdAt)}</time>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {post.comments.length > 3 && (
                                    <button
                                        onClick={() =>
                                            setShowComments((prev) => ({
                                                ...prev,
                                                [post._id]: !expanded,
                                            }))
                                        }
                                        className="text-sm text-blue-600 hover:underline focus:outline-none"
                                    >
                                        {expanded ? "View less" : `View all ${post.comments.length} comments`}
                                    </button>
                                )}
                            </section>

                            {/* Add Comment Input */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddComment(post._id);
                                }}
                                className="flex items-center gap-3 mt-6"
                            >
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentTexts[post._id] || ""}
                                    onChange={(e) =>
                                        setCommentTexts((prev) => ({
                                            ...prev,
                                            [post._id]: e.target.value,
                                        }))
                                    }
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                                    aria-label="Add a comment"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentTexts[post._id] || commentTexts[post._id].trim() === ""}
                                    className={`p-3 rounded-lg transition ${!commentTexts[post._id] || commentTexts[post._id].trim() === ""
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    aria-disabled={!commentTexts[post._id] || commentTexts[post._id].trim() === ""}
                                    aria-label="Submit comment"
                                >
                                    <Send className="h-6 w-6 rotate-90" />
                                </button>
                            </form>
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

export default PostEdit;