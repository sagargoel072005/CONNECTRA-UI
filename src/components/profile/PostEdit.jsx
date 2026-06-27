import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Heart, Send, Image as ImageIcon, Trash2, MessageCircle } from "lucide-react";
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
            const res = await axios.get(`${BASE_URL}/posts/user/${user._id}`, { withCredentials: true });
            setPosts(res.data);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };

    useEffect(() => {
        if (user && user._id) fetchPosts();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption && !media) { alert("Add caption or media"); return; }
        const formData = new FormData();
        formData.append("caption", caption);
        if (media) formData.append("media", media);
        try {
            await axios.post(`${BASE_URL}/posts`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            setCaption(""); setMedia(null); fetchPosts();
        } catch (err) { console.error("Failed to create post", err); }
    };

    const handleToggleLike = async (postId) => {
        try {
            await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, { withCredentials: true });
            fetchPosts();
        } catch (err) { console.error("Failed to toggle like", err); }
    };

    const handleAddComment = async (postId) => {
        const text = commentTexts[postId];
        if (!text || text.trim() === "") return;
        try {
            await axios.post(`${BASE_URL}/posts/${postId}/comment`, { text }, { withCredentials: true });
            setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
            fetchPosts();
        } catch (err) { console.error("Failed to add comment", err); }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`${BASE_URL}/posts/${postId}`, { withCredentials: true });
            fetchPosts();
        } catch (err) { console.error("Failed to delete post", err); }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: "short", day: "numeric", year: "numeric",
        });
    };

    const styles = {
        page: {
            width: "100%",
            minHeight: "100vh",
            background: "linear-gradient(160deg, #05050f 0%, #0a0a1f 40%, #080818 100%)",
            padding: "32px 0 48px",
            fontFamily: "'DM Sans', sans-serif",
        },
        container: {
            maxWidth: 660,
            margin: "0 auto",
            padding: "0 20px",
        },
        // Page heading — "My Network" style
        pageHeading: {
            display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",   // 👈 added: chhoti screen pe badge niche wrap ho jayega, squeeze nahi hoga
    gap: 10,             // 👈 added: wrap hone par heading aur badge ke beech spacing
    marginBottom: 28,
        },
        headingText: {
            margin: 0,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            lineHeight: 1.1,
        },
        headingAccent: {
            color: "#818cf8",
        },
        headingSubtitle: {
            margin: "4px 0 0",
            fontSize: 13,
            color: "rgba(148,163,184,0.5)",
            fontWeight: 400,
        },
        // pill badge — "5 connections" style
        badge: {
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 100,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "#a5b4fc",
            letterSpacing: "0.01em",
        },
        // Create post card
        createCard: {
            background: "rgba(13,13,35,0.7)",
            border: "1px solid rgba(99,102,241,0.18)",
            borderRadius: 20,
            padding: "20px 22px",
            marginBottom: 36,
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        },
        createHeader: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
        },
        avatarSm: {
            width: 38,
            height: 38,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "2px solid rgba(99,102,241,0.4)",
            background: "#1e2640",
        },
        createLabel: {
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(129,140,248,0.6)",
            margin: 0,
        },
        textarea: {
            width: "100%",
            background: "rgba(5,5,20,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "12px 14px",
            color: "#e2e8f0",
            fontSize: 13.5,
            resize: "none",
            outline: "none",
            lineHeight: 1.65,
            boxSizing: "border-box",
            marginBottom: 12,
            transition: "border-color 0.2s",
        },
        createFooter: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
        },
        mediaLabel: {
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 500,
            transition: "color 0.2s",
        },
        postBtn: {
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "9px 26px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.03em",
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            transition: "opacity 0.2s, transform 0.15s",
        },
        postBtnDisabled: {
            background: "rgba(99,102,241,0.15)",
            color: "rgba(255,255,255,0.25)",
            border: "none",
            borderRadius: 10,
            padding: "9px 26px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "not-allowed",
            letterSpacing: "0.03em",
            flexShrink: 0,
        },
        // Section header
        sectionHeader: {
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 18,
        },
        sectionTitle: {
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "-0.01em",
            flexShrink: 0,
        },
        sectionDivider: {
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,0.05)",
        },
        // Post card — Connections card style
        postCard: {
            background: "rgba(10,10,30,0.75)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            marginBottom: 20,
            overflow: "hidden",
            backdropFilter: "blur(14px)",
            boxShadow: "0 2px 24px rgba(0,0,0,0.35)",
            transition: "border-color 0.2s",
        },
        postCardHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
        },
        avatarMd: {
            width: 42,
            height: 42,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "2px solid rgba(99,102,241,0.3)",
            background: "#1e2640",
        },
        userName: {
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "-0.01em",
        },
        userDate: {
            fontSize: 11,
            color: "rgba(148,163,184,0.4)",
            margin: 0,
        },
        postBody: {
            padding: "18px 20px",
        },
        captionText: {
            color: "#cbd5e1",
            fontSize: 14,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            margin: 0,
        },
        actionRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",   // 👈 added: safety, taaki long counts pe overflow na ho
    marginTop: 14,
    marginBottom: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.05)",
},
        actionBtn: {
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(148,163,184,0.6)",
            transition: "all 0.2s",
            letterSpacing: "0.01em",
        },
        actionBtnLiked: {
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "#f87171",
            transition: "all 0.2s",
            letterSpacing: "0.01em",
        },
        // Comments section
        commentsSection: {
            background: "rgba(5,5,18,0.4)",
            borderRadius: 12,
            padding: "14px 16px",
            marginTop: 4,
        },
        commentItem: {
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 12,
        },
        commentAvatar: {
            width: 28,
            height: 28,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: "#1e2640",
            border: "1.5px solid rgba(99,102,241,0.2)",
        },
        commentText: {
            fontSize: 12.5,
            color: "#94a3b8",
            margin: 0,
            lineHeight: 1.55,
        },
        commentAuthor: {
            color: "#e2e8f0",
            fontWeight: 600,
        },
        commentTime: {
            fontSize: 10,
            color: "rgba(148,163,184,0.3)",
            display: "block",
            marginTop: 2,
        },
        commentInputRow: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
        },
        commentInput: {
            flex: 1,
            background: "rgba(5,5,20,0.7)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
            padding: "8px 13px",
            color: "#e2e8f0",
            fontSize: 12.5,
            outline: "none",
            transition: "border-color 0.2s",
        },
        sendBtn: {
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
        },
        sendBtnDisabled: {
            background: "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            cursor: "not-allowed",
            color: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        },
        deleteBtn: {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(148,163,184,0.25)",
            padding: "6px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s",
        },
        viewMoreBtn: {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#818cf8",
            fontSize: 11.5,
            fontWeight: 600,
            padding: "4px 0",
            letterSpacing: "0.02em",
            textDecoration: "none",
            display: "inline-block",
            marginTop: 2,
        },
        emptyState: {
            textAlign: "center",
            color: "rgba(148,163,184,0.25)",
            fontSize: 13,
            marginTop: 48,
            letterSpacing: "0.02em",
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* ── Page Heading ── */}
                <div style={styles.pageHeading}>
                    <div>
                        <h1 style={styles.headingText}>
                            My <span style={styles.headingAccent}>Posts</span>
                        </h1>
                        <p style={styles.headingSubtitle}>Share what's on your mind with your network</p>
                    </div>
                    <div style={styles.badge}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {posts.length} {posts.length === 1 ? "post" : "posts"}
                    </div>
                </div>

                {/* ── Create Post Card ── */}
                <div style={styles.createCard}>
                    <div style={styles.createHeader}>
                        <div style={styles.avatarSm}>
                            <img
                                src={user?.photoUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=5b21b6&color=fff`}
                                alt={user?.firstName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div>
                            <p style={styles.createLabel}>Create Post</p>
                            <p style={{ margin: 0, fontSize: 12, color: "rgba(148,163,184,0.4)", marginTop: 1 }}>
                                {user?.firstName} {user?.lastName}
                            </p>
                        </div>
                    </div>

                    <textarea
                        placeholder="What's on your mind?"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={3}
                        style={styles.textarea}
                        onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.45)"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
                    />

                    <div style={styles.createFooter}>
                        <label
                            htmlFor="media-upload"
                            style={{
                                ...styles.mediaLabel,
                                color: media ? "#a78bfa" : "rgba(148,163,184,0.45)",
                            }}
                        >
                            <ImageIcon size={15} />
                            <span>{media ? media.name.slice(0, 22) + (media.name.length > 22 ? "…" : "") : "Add photo / video"}</span>
                        </label>
                        <input id="media-upload" type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: "none" }} />

                        <button
                            onClick={handleSubmit}
                            disabled={!caption && !media}
                            style={(!caption && !media) ? styles.postBtnDisabled : styles.postBtn}
                        >
                            Post
                        </button>
                    </div>
                </div>

                {/* ── Your Posts Header ── */}
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Your Posts</h2>
                    <div style={styles.sectionDivider} />
                </div>

                {posts.length === 0 && (
                    <p style={styles.emptyState}>No posts yet. Share something with your network!</p>
                )}

                {/* ── Post Cards ── */}
                {posts.map((post) => {
                    const liked = post.likes.some((u) => u === user._id || u._id === user._id);
                    const expanded = showComments[post._id] || false;
                    const commentsToShow = expanded ? post.comments : post.comments.slice(0, 3);
                    const isOwner = post.user._id === user._id || post.user === user._id;

                    return (
                        <article key={post._id} style={styles.postCard}>

                            {/* Card Header */}
                            <div style={styles.postCardHeader}>
                                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                    <div style={styles.avatarMd}>
                                        <img
                                            src={post.user.profilePicture || `https://ui-avatars.com/api/?name=${post.user.firstName}+${post.user.lastName}&background=5b21b6&color=fff`}
                                            alt={post.user.firstName}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div>
                                        <p style={styles.userName}>{post.user.firstName} {post.user.lastName}</p>
                                        <p style={styles.userDate}>{formatDate(post.createdAt)}</p>
                                    </div>
                                </div>
                                {isOwner && (
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => handleDeletePost(post._id)}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(148,163,184,0.25)"; e.currentTarget.style.background = "transparent"; }}
                                        title="Delete post"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>

                            {/* Card Body */}
                            <div style={styles.postBody}>
                                {post.caption && (
                                    <p style={{ ...styles.captionText, marginBottom: post.mediaUrl ? 14 : 0 }}>
                                        {post.caption}
                                    </p>
                                )}

                                {post.mediaUrl && (
                                    /\.(mp4|mov|mkv)$/i.test(post.mediaUrl) ? (
                                        <video controls style={{ width: "100%", borderRadius: 12, marginBottom: 4 }}>
                                            <source src={post.mediaUrl} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img
                                            src={post.mediaUrl}
                                            alt="Post media"
                                            style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 440, display: "block" }}
                                        />
                                    )
                                )}

                                {/* Action Row */}
                                <div style={styles.actionRow}>
                                    <button
                                        onClick={() => handleToggleLike(post._id)}
                                        style={liked ? styles.actionBtnLiked : styles.actionBtn}
                                        onMouseEnter={(e) => { if (!liked) { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)"; } }}
                                        onMouseLeave={(e) => { if (!liked) { e.currentTarget.style.color = "rgba(148,163,184,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; } }}
                                    >
                                        <Heart size={14} fill={liked ? "currentColor" : "none"} strokeWidth={2} />
                                        <span>{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}</span>
                                    </button>

                                    <button
                                        onClick={() => setShowComments((prev) => ({ ...prev, [post._id]: !expanded }))}
                                        style={styles.actionBtn}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(148,163,184,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                                    >
                                        <MessageCircle size={14} />
                                        <span>{post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <div style={styles.commentsSection}>
                                    {post.comments.length === 0 && (
                                        <p style={{ color: "rgba(148,163,184,0.25)", fontSize: 11.5, fontStyle: "italic", margin: "0 0 10px" }}>
                                            No comments yet. Be the first!
                                        </p>
                                    )}

                                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 4px", maxHeight: 200, overflowY: "auto" }}>
                                        {commentsToShow.map((comment) => (
                                            <li key={comment._id} style={styles.commentItem}>
                                                <div style={styles.commentAvatar}>
                                                    <img
                                                        src={comment.user.profilePicture || `https://ui-avatars.com/api/?name=${comment.user.firstName}+${comment.user.lastName}&background=5b21b6&color=fff`}
                                                        alt={comment.user.firstName}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                </div>
                                                <div>
                                                    <p style={styles.commentText}>
                                                        <span style={styles.commentAuthor}>{comment.user.firstName} {comment.user.lastName}</span>
                                                        {" "}{comment.text}
                                                    </p>
                                                    <time style={styles.commentTime}>{formatDate(comment.createdAt)}</time>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {post.comments.length > 3 && (
                                        <button
                                            onClick={() => setShowComments((prev) => ({ ...prev, [post._id]: !expanded }))}
                                            style={styles.viewMoreBtn}
                                        >
                                            {expanded ? "↑ View less" : `View all ${post.comments.length} comments`}
                                        </button>
                                    )}

                                    {/* Add Comment */}
                                    <div style={styles.commentInputRow}>
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={commentTexts[post._id] || ""}
                                            onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post._id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                                            style={styles.commentInput}
                                            onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
                                            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                                        />
                                        <button
                                            onClick={() => handleAddComment(post._id)}
                                            disabled={!commentTexts[post._id] || commentTexts[post._id].trim() === ""}
                                            style={(!commentTexts[post._id] || commentTexts[post._id].trim() === "") ? styles.sendBtnDisabled : styles.sendBtn}
                                        >
                                            <Send size={13} style={{ transform: "rotate(45deg)" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}

            </div>
        </div>
    );
};

export default PostEdit;