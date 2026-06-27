import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const Avatar = ({ user, size = 36 }) => {
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  return user?.photoUrl ? (
    <img
      src={user.photoUrl}
      alt={initials}
      style={{
        width: size, height: size, borderRadius: "50%",
        objectFit: "cover", border: "2px solid rgba(99,102,241,0.4)",
        flexShrink: 0, display: "block",
      }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "#fff",
      flexShrink: 0, border: "2px solid rgba(99,102,241,0.4)",
      userSelect: "none",
    }}>
      {initials}
    </div>
  );
};

const PostCard = ({ post, currentUserId, onLike, onComment, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const liked = post.likes?.some((id) => {
    const idStr = typeof id === "object" ? id?._id?.toString() : id?.toString();
    return idStr === currentUserId?.toString();
  });

  const commented = post.comments?.some((c) => {
    const idStr = typeof c.user === "object" ? c.user?._id?.toString() : c.user?.toString();
    return idStr === currentUserId?.toString();
  });

  const likeCount = post.likes?.length ?? 0;
  const commentCount = post.comments?.length ?? 0;
  const isOwner = post.user?._id?.toString() === currentUserId?.toString();
  const interacted = liked || commented;

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    await onComment(post._id, commentText.trim());
    setCommentText("");
    setSubmitting(false);
  };

  return (
    <div style={{
      background: interacted
        ? "rgba(255,255,255,0.025)"
        : "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: interacted
        ? "1px solid rgba(255,255,255,0.06)"
        : "1px solid rgba(99,102,241,0.18)",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: interacted
        ? "0 2px 12px rgba(0,0,0,0.2)"
        : "0 4px 24px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
      marginBottom: "12px",
      opacity: interacted ? 0.7 : 1,
      transition: "all 0.2s",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px",
      }}>
        <Link
          to={`/profile/${post.user?._id}`}
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <Avatar user={post.user} size={36} />
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#e0e7ff" }}>
              {post.user?.firstName} {post.user?.lastName}
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "rgba(165,180,252,0.4)" }}>
              {timeAgo(post.createdAt)} ago
              {interacted && (
                <span style={{
                  marginLeft: "6px", fontSize: "10px",
                  color: "rgba(165,180,252,0.3)",
                  background: "rgba(99,102,241,0.08)",
                  padding: "1px 6px", borderRadius: "4px",
                }}>
                  {liked && commented ? "liked & commented" : liked ? "liked" : "commented"}
                </span>
              )}
            </p>
          </div>
        </Link>
        {isOwner && (
          <button
            onClick={() => onDelete(post._id)}
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "#f87171", borderRadius: "8px",
              padding: "4px 10px", fontSize: "12px",
              cursor: "pointer", fontWeight: 500,
            }}
          >
            Delete
          </button>
        )}
      </div>

      {/* Media */}
      {post.mediaUrl && (
        post.mediaType === "video" ? (
          <video src={post.mediaUrl} controls
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" }} />
        ) : (
          <img src={post.mediaUrl} alt="post"
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" }} />
        )
      )}

      {/* Caption */}
      {post.caption && (
        <div style={{ padding: "10px 14px 4px" }}>
          <span style={{ fontSize: "13px", color: "#c7d2fe", fontWeight: 600, marginRight: "6px" }}>
            {post.user?.firstName}
          </span>
          <span style={{ fontSize: "13px", color: "rgba(165,180,252,0.75)", lineHeight: 1.6 }}>
            {post.caption}
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: "8px 14px 10px", display: "flex", gap: "18px", alignItems: "center" }}>
        <button
          onMouseDown={(e) => { e.preventDefault(); onLike(post._id); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px",
            color: liked ? "#f472b6" : "rgba(165,180,252,0.5)",
            fontSize: "13px", fontWeight: 600, padding: 0,
            transition: "color 0.15s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={liked ? "#f472b6" : "none"}
            stroke={liked ? "#f472b6" : "rgba(165,180,252,0.5)"}
            strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likeCount}
        </button>

        <button
          onClick={() => {
            setShowComments(!showComments);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px",
            color: showComments ? "#818cf8" : "rgba(165,180,252,0.5)",
            fontSize: "13px", fontWeight: 600, padding: 0,
            transition: "color 0.15s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {commentCount}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 14px 12px" }}>
          <div style={{
            maxHeight: "180px", overflowY: "auto",
            marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px",
          }}>
            {post.comments?.length === 0 && (
              <p style={{ fontSize: "12px", color: "rgba(165,180,252,0.3)", margin: 0 }}>No comments yet.</p>
            )}
            {post.comments?.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <Avatar user={c.user} size={26} />
                <div style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.1)",
                  borderRadius: "8px", padding: "6px 10px",
                }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#c7d2fe", marginRight: "5px" }}>
                    {c.user?.firstName}
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(165,180,252,0.7)" }}>{c.text}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} style={{ display: "flex", gap: "8px" }}>
            <input
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,102,241,0.18)",
                borderRadius: "8px", padding: "8px 12px",
                fontSize: "13px", color: "#e0e7ff", outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none", borderRadius: "8px",
                padding: "8px 14px", color: "#fff",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                opacity: !commentText.trim() || submitting ? 0.5 : 1,
              }}
            >Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const userData = useSelector((store) => store.user);
  const currentUserId = userData?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef(null);

  const fetchFeed = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/posts/feed", { withCredentials: true });

      // Sort: unseen (not liked & not commented) first, interacted last
      const sorted = [...data].sort((a, b) => {
        const interacted = (post) => {
          const liked = post.likes?.some((id) => {
            const idStr = typeof id === "object" ? id?._id?.toString() : id?.toString();
            return idStr === currentUserId?.toString();
          });
          const commented = post.comments?.some((c) => {
            const idStr = typeof c.user === "object" ? c.user?._id?.toString() : c.user?.toString();
            return idStr === currentUserId?.toString();
          });
          return liked || commented;
        };
        return interacted(a) - interacted(b); // false(0) first, true(1) last
      });

      setPosts(sorted);
    } catch (e) {
      setError("Failed to load feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, [currentUserId]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file) return;
    setPosting(true);
    try {
      const formData = new FormData();
      if (caption.trim()) formData.append("caption", caption.trim());
      if (file) formData.append("media", file);
      const { data } = await axios.post(BASE_URL + "/posts/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts((prev) => [data, ...prev]);
      setCaption("");
      setFile(null);
      setPreview(null);
    } catch (e) {
      alert("Failed to post.");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/posts/${postId}/like`, {},
        { withCredentials: true }
      );
      setPosts((prev) => prev.map((p) => (p._id === postId ? data : p)));
    } catch (e) {}
  };

  const handleComment = async (postId, text) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/posts/${postId}/comment`,
        { text },
        { withCredentials: true }
      );
      setPosts((prev) => prev.map((p) => (p._id === postId ? data : p)));
    } catch (e) {}
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${BASE_URL}/posts/${postId}`, { withCredentials: true });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (e) {}
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060414 0%, #0d0b2e 40%, #0a0820 70%, #050210 100%)",
      color: "white",
      fontFamily: "'Inter', sans-serif",
      padding: "24px 24px 60px",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Ambient glows */}
      <div style={{
  position: "absolute", top: "-80px", left: "-80px", width: "400px", height: "400px",
  background: "radial-gradient(circle, rgba(99,78,220,0.14) 0%, transparent 70%)",
  pointerEvents: "none", zIndex: 0,
}} />
<div style={{
  position: "absolute", bottom: "-80px", right: "-60px", width: "360px", height: "360px",
  background: "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
  pointerEvents: "none", zIndex: 0,
}} />

      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
        width: "100%", boxSizing: "border-box",
      }}>

{/* Title */}
<div style={{ marginBottom: "24px" }}>
  <div style={{
    display: "inline-flex", alignItems: "center", gap: "6px",
    fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#a5b4fc",
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.25)",
    padding: "5px 14px", borderRadius: "999px",
    marginBottom: "14px",
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block", boxShadow: "0 0 6px #818cf8" }} />
    Feed
  </div>
  <h1 style={{
    margin: "0 0 8px",
    fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
    fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15,
    color: "#e0e7ff",
  }}>
    What builders are{" "}
    <span style={{
      background: "linear-gradient(90deg,#818cf8,#a78bfa,#c084fc)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>shipping</span>
  </h1>
  <p style={{
    margin: 0,
    fontSize: "14px",
    color: "rgba(165,180,252,0.5)",
    fontWeight: 400,
    lineHeight: 1.6,
  }}>
    Updates from developers you need to see
  </p>
</div>

        {/* Create Post */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px", padding: "12px 14px",
          marginBottom: "18px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <form onSubmit={handlePost}>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What are you building? Share an update..."
              rows={2}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "10px", padding: "10px 12px",
                fontSize: "13px", color: "#e0e7ff",
                resize: "none", outline: "none",
                boxSizing: "border-box", lineHeight: 1.5,
                fontFamily: "inherit",
              }}
            />

            {preview && (
              <div style={{ position: "relative", marginTop: "8px", borderRadius: "10px", overflow: "hidden" }}>
                {file?.type.startsWith("video") ? (
                  <video src={preview} style={{ width: "100%", maxHeight: "160px", objectFit: "cover" }} />
                ) : (
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: "160px", objectFit: "cover" }} />
                )}
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  style={{
                    position: "absolute", top: "6px", right: "6px",
                    background: "rgba(0,0,0,0.6)", border: "none",
                    color: "#fff", borderRadius: "50%",
                    width: "24px", height: "24px", cursor: "pointer",
                    fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >×</button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "#a5b4fc", borderRadius: "8px",
                  padding: "6px 12px", fontSize: "12px",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                {file ? file.name.slice(0, 18) + "…" : "Add photo / video"}
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: "none" }} />

              <button
                type="submit"
                disabled={(!caption.trim() && !file) || posting}
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  border: "none", borderRadius: "8px",
                  padding: "7px 18px", color: "#fff",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  opacity: (!caption.trim() && !file) || posting ? 0.5 : 1,
                  boxShadow: "0 3px 12px rgba(99,102,241,0.3)",
                }}
              >
                {posting ? "Posting…" : "Share →"}
              </button>
            </div>
          </form>
        </div>

        {/* Feed */}
        {loading && (
          <div style={{ textAlign: "center", color: "rgba(165,180,252,0.4)", padding: "40px 0", fontSize: "14px" }}>
            Loading feed…
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", color: "#f87171", padding: "20px 0", fontSize: "14px" }}>{error}</div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 0",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}>
            <p style={{ fontSize: "32px", margin: "0 0 8px" }}>🚀</p>
            <p style={{ fontSize: "14px", color: "rgba(165,180,252,0.5)", margin: 0 }}>
              No posts yet. Be the first to ship something!
            </p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUserId={currentUserId}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;