import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MessageCircle, UserMinus, UserCheck, UserX,
  Search, MapPin, Clock, Github, Linkedin, Twitter,
  Code2, Globe, ChevronDown, X, Check, Wifi, WifiOff,
  Briefcase,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const StarCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1 + 0.2, a: Math.random(),
      da: (Math.random() - 0.5) * 0.004,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,255,${s.a * 0.5})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
};


const SKILL_COLORS = [
  "99,102,241", "139,92,246", "96,165,250",
  "52,211,153", "251,191,36", "244,114,182",
];

const SkillTag = ({ skill, idx = 0 }) => {
  const accent = SKILL_COLORS[idx % SKILL_COLORS.length];
  return (
    <span
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10.5px] font-semibold"
      style={{
        background: `rgba(${accent},0.12)`,
        border: `1px solid rgba(${accent},0.22)`,
        color: `rgba(${accent},1)`,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {skill}
    </span>
  );
};


const StatPill = ({ value, label, color }) => (
  <div
    className="text-center flex-1 rounded-2xl py-4 px-5"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      minWidth: 80,
    }}
  >
    <div
      className="font-extrabold tracking-tight"
      style={{
        fontFamily: "'Syne',sans-serif",
        fontSize: 24,
        background: `linear-gradient(135deg,${color},${color}88)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-1px",
      }}
    >
      {value}
    </div>
    <div
      className="uppercase mt-1"
      style={{
        fontSize: 10,
        color: "rgba(148,163,184,0.45)",
        fontWeight: 600,
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </div>
  </div>
);


const ConnectionCard = ({ user, onMessage, onRemove }) => {

  const [removing, setRemoving] = useState(false);
  const accent = SKILL_COLORS[Math.abs((user?.firstName?.charCodeAt(0) || 0) % SKILL_COLORS.length)];

  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown";
  const avatar = user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}&backgroundColor=b6e3f4`;
const navigate = useNavigate();

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(user?._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 60, damping: 16 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(8,8,28,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.06), 0 12px 32px rgba(0,0,0,0.4)",
      }}
      whileHover={{ y: -3, boxShadow: "0 0 0 1px rgba(99,102,241,0.18), 0 20px 48px rgba(0,0,0,0.5)" }}
    >
      {/* Cover strip */}
      <div
        className="h-16 relative"
        style={{
          background: `linear-gradient(135deg,rgba(${accent},0.35),rgba(0,0,0,0.5))`,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="relative inline-block -mt-7 mb-3">
          <img
            src={avatar}
            alt={displayName}
            className="w-14 h-14 rounded-[14px] object-cover"
            style={{
              border: `2.5px solid rgba(${accent},0.35)`,
              boxShadow: `0 0 20px rgba(${accent},0.2)`,
            }}
            onError={e => {
              e.currentTarget.src = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
            }}
          />
        </div>

        {/* Info */}
        <div
          className="font-bold text-white leading-tight truncate"
          style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, letterSpacing: "-0.3px" }}
        >
          {displayName}
        </div>
        <div className="text-xs mt-0.5 truncate" style={{ color: "rgba(148,163,184,0.5)" }}>
          {user?.company ? `@ ${user.company}` : user?.about?.slice(0, 40) || "Connectra Member"}
        </div>

        {/* Location */}
        {user?.location && (
          <div
            className="flex items-center gap-1.5 mt-2 text-xs"
            style={{ color: "rgba(148,163,184,0.4)" }}
          >
            <MapPin size={11} style={{ color: "#818cf8" }} />
            {user.location}
          </div>
        )}

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.skills.slice(0, 3).map((s, i) => (
              <SkillTag key={s} skill={s} idx={i} />
            ))}
            {user.skills.length > 3 && (
              <span
                className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10.5px] font-semibold"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(148,163,184,0.45)",
                }}
              >
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Social row */}
        {(user?.githubId || user?.linkedIn || user?.twitterId || user?.leetcodeId) && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {user.githubId && (
              <a
                href={`https://github.com/${user.githubId}`}
                target="_blank"
                rel="noreferrer"
                className="conn-social-link flex items-center gap-1 px-2.5 py-1.5 rounded-lg no-underline text-[10.5px] font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(148,163,184,0.5)",
                }}
              >
                <Github size={11} /> {user.githubId}
              </a>
            )}
            {user.linkedIn && (
              <a
                href={`https://linkedin.com/in/${user.linkedIn}`}
                target="_blank"
                rel="noreferrer"
                className="conn-social-link flex items-center gap-1 px-2.5 py-1.5 rounded-lg no-underline text-[10.5px] font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(148,163,184,0.5)",
                }}
              >
                <Linkedin size={11} /> {user.linkedIn}
              </a>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button
            className="conn-msg-btn flex-1 flex items-center justify-center gap-1.5 rounded-xl border-none text-white text-xs font-semibold cursor-pointer transition-all duration-200 py-2.5"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: "0 0 16px rgba(99,102,241,0.25)",
            }}
            onClick={() => onMessage(user)}
          >
            <MessageCircle size={13} /> Message
          </button>
          <button
            className="conn-view-btn flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 py-2.5 px-3.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(148,163,184,0.6)",
              fontFamily: "'DM Sans',sans-serif",
            }}
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <Users size={13} /> View
          </button>
          <button
            className="conn-remove-btn flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 py-2.5 px-2.5"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              color: removing ? "#fca5a5" : "rgba(252,165,165,0.5)",
            }}
            onClick={handleRemove}
            disabled={removing}
            title="Remove connection"
          >
            {removing ? <div className="conn-spinner" /> : <UserMinus size={13} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const PendingCard = ({ request, onAccept, onReject }) => {
  const [acting, setActing] = useState(null); // "accept" | "reject"
  const user = request?.fromUserId;
  const accent = SKILL_COLORS[Math.abs((user?.firstName?.charCodeAt(0) || 0) % SKILL_COLORS.length)];
  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown";
  const avatar = user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}&backgroundColor=b6e3f4`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 60, damping: 16 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(8,8,28,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.06), 0 12px 32px rgba(0,0,0,0.4)",
      }}
      whileHover={{ y: -2 }}
    >
      {/* Cover strip */}
      <div
        className="h-14 relative"
        style={{ background: `linear-gradient(135deg,rgba(${accent},0.28),rgba(0,0,0,0.5))` }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Pending badge */}
        <div
          className="absolute top-2.5 right-3 flex items-center gap-1 rounded-md px-2 py-0.5"
          style={{
            background: "rgba(251,191,36,0.12)",
            border: "1px solid rgba(251,191,36,0.25)",
            fontSize: 9.5,
            fontWeight: 700,
            color: "#fbbf24",
            letterSpacing: "0.06em",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <Clock size={9} /> PENDING
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="relative inline-block -mt-7 mb-3">
          <img
            src={avatar}
            alt={displayName}
            className="w-14 h-14 rounded-[14px] object-cover"
            style={{ border: `2.5px solid rgba(${accent},0.35)`, boxShadow: `0 0 20px rgba(${accent},0.2)` }}
            onError={e => { e.currentTarget.src = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"; }}
          />
        </div>

        <div className="font-bold text-white leading-tight truncate" style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, letterSpacing: "-0.3px" }}>
          {displayName}
        </div>
        <div className="text-xs mt-0.5 truncate" style={{ color: "rgba(148,163,184,0.5)" }}>
          {user?.company ? `@ ${user.company}` : user?.about?.slice(0, 40) || "Connectra Member"}
        </div>

        {user?.location && (
          <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>
            <MapPin size={11} style={{ color: "#818cf8" }} /> {user.location}
          </div>
        )}

        {user?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.skills.slice(0, 3).map((s, i) => <SkillTag key={s} skill={s} idx={i} />)}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-none text-white text-xs font-semibold cursor-pointer transition-all duration-200 py-2.5 conn-accept-btn"
            style={{ background: "linear-gradient(135deg,#059669,#34d399)", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 16px rgba(52,211,153,0.2)" }}
            onClick={async () => { setActing("accept"); await onAccept(request._id); }}
            disabled={!!acting}
          >
            {acting === "accept" ? <div className="conn-spinner" /> : <><UserCheck size={13} /> Accept</>}
          </button>
          <button
            className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 py-2.5 px-4 conn-reject-btn"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "rgba(252,165,165,0.65)", fontFamily: "'DM Sans',sans-serif" }}
            onClick={async () => { setActing("reject"); await onReject(request._id); }}
            disabled={!!acting}
          >
            {acting === "reject" ? <div className="conn-spinner" style={{ borderTopColor: "#fca5a5" }} /> : <><UserX size={13} /> Decline</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const EmptyState = ({ tab }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 gap-4"
    style={{ color: "rgba(148,163,184,0.3)" }}
  >
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.12)" }}
    >
      {tab === "connections" ? <Users size={28} style={{ color: "rgba(99,102,241,0.4)" }} /> : <Clock size={28} style={{ color: "rgba(251,191,36,0.4)" }} />}
    </div>
    <div className="text-center">
      <div className="font-semibold text-sm" style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'Syne',sans-serif" }}>
        {tab === "connections" ? "No connections yet" : "No pending requests"}
      </div>
      <div className="text-xs mt-1" style={{ color: "rgba(148,163,184,0.3)" }}>
        {tab === "connections" ? "Start connecting with developers on Connectra" : "You're all caught up!"}
      </div>
    </div>
  </motion.div>
);


const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoad, setPendingLoad] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [toast, setToast] = useState(null); // { msg, type }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch accepted connections ── */
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
        // API returns array of user objects (the other person in each accepted pair)
        setConnections(res.data?.data || res.data || []);
      } catch (err) {
        showToast("Failed to load connections", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  /* ── Fetch pending requests ── */
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setPendingLoad(true);
        const res = await axios.get(BASE_URL + "/user/request/received", { withCredentials: true });
        // API returns array of connection request objects with fromUserId populated
        setPending(res.data?.data || res.data || []);
      } catch {
        // silently fail if endpoint doesn't exist yet
      } finally {
        setPendingLoad(false);
      }
    };
    fetchPending();
  }, []);

  /* ── Accept request ── */
  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${requestId}/accepted`,
        {},
        { withCredentials: true }
      );
      const accepted = pending.find(r => r._id === requestId);
      setPending(p => p.filter(r => r._id !== requestId));
      if (accepted?.fromUserId) setConnections(c => [accepted.fromUserId, ...c]);
      showToast("Connection accepted!");
    } catch {
      showToast("Failed to accept request", "error");
    }
  };

  /* ── Reject request ── */
  const handleReject = async (requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${requestId}/rejected`,
        {},
        { withCredentials: true }
      );
      setPending(p => p.filter(r => r._id !== requestId));
      showToast("Request declined");
    } catch {
      showToast("Failed to decline request", "error");
    }
  };

  /* ── Remove connection ── */
  const handleRemove = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/connection/remove/${userId}`, { withCredentials: true });
      setConnections(c => c.filter(u => u._id !== userId));
      showToast("Connection removed");
    } catch {
      // Rollback or show error
      showToast("Failed to remove connection", "error");
    }
  };

  const handleMessage = (user) => {
    navigate(`/chat/${user._id}`);
  };

  /* ── Filtered connections ── */
  const filteredConnections = connections.filter(u => {
    const q = search.toLowerCase();
    const matchesSearch = !q
      || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
      || (u.skills || []).join(" ").toLowerCase().includes(q)
      || (u.company || "").toLowerCase().includes(q)
      || (u.location || "").toLowerCase().includes(q);

    const matchesFilter =
      activeFilter === "all" ||
      (u.skills || []).some(s => s.toLowerCase().includes(activeFilter));

    return matchesSearch && matchesFilter;
  });

  /* ── Unique skills for filter chips ── */
  const allSkills = [...new Set(connections.flatMap(u => u.skills || []))].slice(0, 5);

  const TABS = [
    { id: "connections", label: "Connections", count: connections.length },
    { id: "pending", label: "Pending", count: pending.length },
  ];

  return (
    <>

      <div
        className="conn-root relative min-h-screen overflow-x-hidden pb-24"
        style={{ background: "#060614", fontFamily: "'DM Sans',sans-serif" }}
      >
        <StarCanvas />

        {/* BG orbs */}
        <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", top: -100, right: -100, filter: "blur(80px)" }} />
        <div className="fixed rounded-full pointer-events-none z-0" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)", bottom: 50, left: -100, filter: "blur(80px)" }} />

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="fixed bottom-7 right-7 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5"
              style={{
                background: "rgba(8,8,28,0.95)",
                border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.3)"}`,
                boxShadow: `0 0 32px ${toast.type === "error" ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.2)"},0 16px 40px rgba(0,0,0,0.4)`,
                fontSize: 13.5, fontWeight: 600, color: "#e2e8f0",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: toast.type === "error" ? "linear-gradient(135deg,#ef4444,#b91c1c)" : "linear-gradient(135deg,#6366f1,#34d399)" }}
              >
                {toast.type === "error" ? <X size={14} color="#fff" /> : <Check size={14} color="#fff" />}
              </div>
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-7 pt-10">

          {/* ── PAGE HEADER ── */}
          <motion.div
            className="flex items-start justify-between flex-wrap gap-4 mb-6"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          >
            <div>
              <h1
                className="font-extrabold text-white leading-none"
                style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-1px" }}
              >
                My{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Network
                </span>
              </h1>
              <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.4)" }}>
                People you've connected with on Connectra
              </p>
            </div>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                fontSize: 12,
                fontWeight: 600,
                color: "#a5b4fc",
              }}
            >
              <Users size={14} /> {connections.length} connections
            </div>
          </motion.div>

          {/* ── STATS BAR ── */}
          <motion.div
            className="flex gap-3 flex-wrap mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.05 }}
          >
            <StatPill value={connections.length} label="Total" color="#818cf8" />
            <StatPill value={pending.length} label="Pending" color="#fbbf24" />
            <StatPill value={connections.filter(u => (u.skills || []).length > 0).length} label="With Skills" color="#34d399" />
            <StatPill value={connections.filter(u => u.githubId).length} label="On GitHub" color="#60a5fa" />
          </motion.div>

          {/* ── TABS ── */}
          <motion.div
            className="flex gap-1 rounded-xl p-1 w-fit mb-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`conn-tab px-4 py-1.5 rounded-[9px] text-xs font-semibold cursor-pointer border-none capitalize tracking-wide ${activeTab === tab.id ? "active" : ""}`}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: activeTab === tab.id ? "#fff" : "rgba(148,163,184,0.55)",
                  background: "transparent",
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className="ml-1.5 rounded-md px-1.5 py-0.5 text-[10px]"
                    style={{
                      background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "rgba(99,102,241,0.15)",
                      color: activeTab === tab.id ? "#fff" : "#a5b4fc",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* ── CONNECTIONS TAB ── */}
          <AnimatePresence mode="wait">
            {activeTab === "connections" && (
              <motion.div
                key="connections-tab"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* Search */}
                <div className="relative mb-4">
                  <Search
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "rgba(148,163,184,0.35)" }}
                  />
                  <input
                    type="text"
                    className="conn-search w-full rounded-xl border text-sm outline-none pl-10 pr-4 py-3"
                    style={{
                      background: "rgba(8,8,28,0.85)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      fontFamily: "'DM Sans',sans-serif",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="Search by name, skill, or company…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                      style={{ color: "rgba(148,163,184,0.4)" }}
                      onClick={() => setSearch("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                {allSkills.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-5">
                    <button
                      className={`conn-filter-btn px-3.5 py-1.5 rounded-[9px] text-[11.5px] font-semibold cursor-pointer border text-sm ${activeFilter === "all" ? "active" : ""}`}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(148,163,184,0.55)",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                      onClick={() => setActiveFilter("all")}
                    >
                      All
                    </button>
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        className={`conn-filter-btn px-3.5 py-1.5 rounded-[9px] text-[11.5px] font-semibold cursor-pointer ${activeFilter === skill.toLowerCase() ? "active" : ""}`}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "rgba(148,163,184,0.55)",
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                        onClick={() => setActiveFilter(activeFilter === skill.toLowerCase() ? "all" : skill.toLowerCase())}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}

                {/* Grid */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="conn-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderTopColor: "#818cf8" }} />
                    <span className="text-sm" style={{ color: "rgba(148,163,184,0.4)" }}>Loading connections…</span>
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <EmptyState tab="connections" />
                ) : (
                  <motion.div layout className="conn-card-grid">
                    <AnimatePresence>
                      {filteredConnections.map(user => (
                        <ConnectionCard
                          key={user._id}
                          user={user}
                          onMessage={handleMessage}
                          onRemove={handleRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── PENDING TAB ── */}
            {activeTab === "pending" && (
              <motion.div
                key="pending-tab"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                {pendingLoad ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="conn-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderTopColor: "#fbbf24" }} />
                    <span className="text-sm" style={{ color: "rgba(148,163,184,0.4)" }}>Loading requests…</span>
                  </div>
                ) : pending.length === 0 ? (
                  <EmptyState tab="pending" />
                ) : (
                  <>
                    <div
                      className="text-[10px] font-bold uppercase mb-4"
                      style={{ color: "#818cf8", letterSpacing: "0.12em" }}
                    >
                      Incoming Requests · {pending.length}
                    </div>
                    <motion.div layout className="conn-card-grid">
                      <AnimatePresence>
                        {pending.map(request => (
                          <PendingCard
                            key={request._id}
                            request={request}
                            onAccept={handleAccept}
                            onReject={handleReject}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Connections;