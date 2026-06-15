import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/feedSlice";
import { useEffect, useState, useRef } from "react";
import UserCard from "./profile/UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Filter, Code2, Zap } from "lucide-react";
import "../../src/index.css"
import StarCanvas from "./profile/StarCanvas";

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div
    style={{
      borderRadius: 20,
      overflow: "hidden",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      height: 380,
      animation: "skPulse 1.8s ease-in-out infinite",
    }}
  >
    <div style={{ height: 160, background: "rgba(99,102,241,0.07)" }} />
    <div style={{ padding: "20px 20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.12)",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 13,
              borderRadius: 6,
              background: "rgba(255,255,255,0.08)",
              marginBottom: 8,
              width: "65%",
            }}
          />
          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: "rgba(255,255,255,0.05)",
              width: "45%",
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.05)",
          marginBottom: 7,
          width: "90%",
        }}
      />
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.04)",
          width: "70%",
        }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 24,
              width: 60,
              borderRadius: 8,
              background: "rgba(99,102,241,0.08)",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <div
          style={{
            flex: 1,
            height: 38,
            borderRadius: 11,
            background: "rgba(99,102,241,0.12)",
          }}
        />
        <div
          style={{
            flex: 1,
            height: 38,
            borderRadius: 11,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>
    </div>
  </div>
);

/* ── Filter pill ── */
const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: 20,
      border: active
        ? "1px solid rgba(99,102,241,0.6)"
        : "1px solid rgba(255,255,255,0.1)",
      background: active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
      color: active ? "#a5b4fc" : "rgba(148,163,184,0.7)",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.18s",
      letterSpacing: "0.03em",
    }}
  >
    {label}
  </button>
);

/* ── Main Feed ── */
const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [animation, setAnimation] = useState({ id: null, type: "" });

  const FILTERS = ["All", "React", "Node", "Python", "Go", "AI/ML", "DevOps"];

  const getFeed = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!feed) getFeed();
  }, [feed]);

  const handleAction = async (status, userId) => {
    try {
      setAnimation({
        id: userId,
        type: status === "ignored" ? "left" : "right",
      });
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      setTimeout(() => {
        dispatch(removeFeed(userId));
        setAnimation({ id: null, type: "" });
      }, 320);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFeed = (feed || []).filter((user) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (user.skills || []).some((s) =>
        s.toLowerCase().includes(activeFilter.toLowerCase())
      );
    return matchSearch && matchFilter;
  });

  return (
    <>

      <div className="feed-root">
        <StarCanvas />

        {/* Glow orbs */}
        <div className="f-orb" style={{ width: 520, height: 520, background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", top: -160, right: -80 }} />
        <div className="f-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", bottom: 60, left: -100 }} />

        <div className="feed-body">

          {/* ── Topbar ── */}
          <div className="feed-topbar">
            <div className="feed-logo">
              <div className="feed-logo-icon">
                <Code2 size={16} color="#fff" />
              </div>
              <span className="feed-logo-name">Connectra</span>
              <span className="feed-logo-badge">Beta</span>
            </div>
          </div>

          {/* ── Hero ── */}
          <div className="feed-hero">
            <div>
              <div className="feed-eyebrow">
                <span className="feed-eyebrow-dot" />
                Live feed
              </div>
              <h1 className="feed-title">
                Find your next<br />
                <span className="feed-title-grad">collaborator</span>
              </h1>
              <p className="feed-subtitle">
                {filteredFeed.length > 0
                  ? `${filteredFeed.length} developer${filteredFeed.length !== 1 ? "s" : ""} ready to connect`
                  : "No developers match your filters"}
              </p>
            </div>

            {/* Search */}
            <div className="feed-search-wrap">
              <span className="feed-search-icon">
                <Search size={14} color="rgba(148,163,184,0.4)" />
              </span>
              <input
                type="text"
                className="feed-search-input"
                placeholder="Search developers…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    onClick={() => setSearchTerm("")}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    style={{
                      position: "absolute", right: 10, top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      padding: 2, display: "flex",
                      color: "rgba(148,163,184,0.5)",
                    }}
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Real stats (only total count from actual feed) ── */}
          <div className="feed-stats">
            <div className="feed-stat-badge">
              <div className="feed-stat-icon" style={{ background: "rgba(99,102,241,0.2)" }}>
                <Users size={13} color="#6366f1" />
              </div>
              <div>
                <div className="feed-stat-value">{(feed || []).length}</div>
                <div className="feed-stat-label">Developers</div>
              </div>
            </div>

            <div className="feed-stat-badge">
              <div className="feed-stat-icon" style={{ background: "rgba(52,211,153,0.2)" }}>
                <Zap size={13} color="#34d399" />
              </div>
              <div>
                <div className="feed-stat-value">{Math.min(filteredFeed.length, 15)}</div>
                <div className="feed-stat-label">Showing</div>
              </div>
            </div>
          </div>

          <div className="feed-divider" />

          {/* ── Filters ── */}
          <div className="feed-filters">
            <div className="feed-filter-label">
              <Filter size={11} />
              Stack
            </div>
            {FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>

          {/* ── Section heading ── */}
          <div className="feed-section-row">
            <span className="feed-section-title">
              {searchTerm ? `Results for "${searchTerm}"` : "Suggested for you"}
            </span>
            {filteredFeed.length > 0 && (
              <span className="feed-count-badge">
                {Math.min(filteredFeed.length, 15)} shown
              </span>
            )}
          </div>

          {/* ── Grid ── */}
          <div className="feed-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            ) : filteredFeed.length === 0 ? (
              <div className="feed-empty">
                <div className="feed-empty-ring">
                  {searchTerm ? (
                    <Search size={30} color="#818cf8" />
                  ) : (
                    <Users size={30} color="#818cf8" />
                  )}
                </div>
                <div className="feed-empty-title">
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : "You're all caught up!"}
                </div>
                <p className="feed-empty-sub">
                  {searchTerm
                    ? "Try a different name or clear the search to browse all developers."
                    : "You've reviewed everyone in your feed. Check back soon for new developers."}
                </p>
                {(searchTerm || activeFilter !== "All") && (
                  <button
                    className="feed-empty-btn"
                    onClick={() => { setSearchTerm(""); setActiveFilter("All"); }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredFeed.slice(0, 15).map((user, i) => (
                <motion.div
                  key={user._id}
                  className={
                    animation.id === user._id
                      ? animation.type === "left"
                        ? "card-swipe-left"
                        : "card-swipe-right"
                      : ""
                  }
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                  }}
                  layout
                >
                  <UserCard
                    user={user}
                    onAction={(status) => handleAction(status, user._id)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;