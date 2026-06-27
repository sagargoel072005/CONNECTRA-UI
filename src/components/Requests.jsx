import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { UserCheck, UserX, Inbox, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";

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
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
};

const SKILL_COLORS = [
  "99,102,241", "139,92,246", "96,165,250",
  "52,211,153", "251,191,36", "244,114,182",
];

const SkillTag = ({ skill, idx = 0 }) => {
  const accent = SKILL_COLORS[idx % SKILL_COLORS.length];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      borderRadius: 8, padding: "3px 10px",
      fontSize: 10.5, fontWeight: 600,
      background: `rgba(${accent},0.12)`,
      border: `1px solid rgba(${accent},0.22)`,
      color: `rgba(${accent},1)`,
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {skill}
    </span>
  );
};

const RequestCard = ({ request, onAccept, onReject }) => {
  const [acting, setActing] = useState(null);
  const user = request?.fromUserId;
  const accent = SKILL_COLORS[Math.abs((user?.firstName?.charCodeAt(0) || 0) % SKILL_COLORS.length)];
  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown";
  const avatar = user?.photoUrl;
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 60, damping: 16 }}
      whileHover={{ y: -3, boxShadow: "0 0 0 1px rgba(99,102,241,0.18), 0 20px 48px rgba(0,0,0,0.5)" }}
      style={{
        borderRadius: 20,
        background: "rgba(8,8,28,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.06), 0 12px 32px rgba(0,0,0,0.4)",
        overflow: "visible", // avatar bahar aane dega
      }}
    >
      {/* Cover strip — avatar yahan se overlap karega */}
      <div style={{
        height: 80, position: "relative",
        borderRadius: "20px 20px 0 0",
        background: `linear-gradient(135deg,rgba(${accent},0.35),rgba(0,0,0,0.5))`,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
        {/* Pending badge */}
        <div style={{
          position: "absolute", top: 10, right: 12,
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(251,191,36,0.12)",
          border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 6, padding: "2px 8px",
          fontSize: 9.5, fontWeight: 700, color: "#fbbf24",
          letterSpacing: "0.06em", fontFamily: "'DM Sans',sans-serif",
        }}>
          <Clock size={9} /> PENDING
        </div>
      </div>

      {/* Avatar — cover strip ke baad, negative margin se overlap */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ marginTop: -28, marginBottom: 10, display: "inline-block" }}>
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              style={{
                width: 56, height: 56, borderRadius: 14, objectFit: "cover",
                border: `2.5px solid rgba(${accent},0.5)`,
                boxShadow: `0 0 20px rgba(${accent},0.3), 0 4px 12px rgba(0,0,0,0.4)`,
                display: "block",
                position: "relative", zIndex: 2,
              }}
              onError={e => { e.currentTarget.src = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"; }}
            />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: `linear-gradient(135deg,rgba(${accent},0.6),rgba(${accent},0.3))`,
              border: `2.5px solid rgba(${accent},0.5)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: "#fff",
              boxShadow: `0 4px 12px rgba(0,0,0,0.4)`,
            }}>
              {initials}
            </div>
          )}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Syne',sans-serif", fontSize: 15,
          fontWeight: 700, color: "#fff", letterSpacing: "-0.3px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {displayName}
        </div>

        {/* About */}
        <div style={{
          fontSize: 12, color: "rgba(148,163,184,0.5)",
          marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {user?.about?.slice(0, 45) || user?.company || "Connectra Member"}
        </div>

        {/* Location */}
        {user?.location && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            marginTop: 8, fontSize: 12, color: "rgba(148,163,184,0.4)",
          }}>
            <MapPin size={11} style={{ color: "#818cf8" }} />
            {user.location}
          </div>
        )}

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {user.skills.slice(0, 3).map((s, i) => (
              <SkillTag key={s} skill={s} idx={i} />
            ))}
            {user.skills.length > 3 && (
              <span style={{
                display: "inline-flex", alignItems: "center",
                borderRadius: 8, padding: "3px 10px",
                fontSize: 10.5, fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(148,163,184,0.45)",
              }}>
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            disabled={!!acting}
            onClick={async () => { setActing("accept"); await onAccept(request._id); }}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              borderRadius: 12, border: "none", cursor: acting ? "not-allowed" : "pointer",
              padding: "10px 0", fontSize: 13, fontWeight: 600, color: "#fff",
              background: "linear-gradient(135deg,#059669,#34d399)",
              boxShadow: "0 0 16px rgba(52,211,153,0.2)",
              fontFamily: "'DM Sans',sans-serif",
              opacity: acting ? 0.6 : 1, transition: "all 0.15s",
            }}
          >
            {acting === "accept"
              ? <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
              : <><UserCheck size={13} /> Accept</>
            }
          </button>
          <button
            disabled={!!acting}
            onClick={async () => { setActing("reject"); await onReject(request._id); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              borderRadius: 12, cursor: acting ? "not-allowed" : "pointer",
              padding: "10px 16px", fontSize: 13, fontWeight: 600,
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "rgba(252,165,165,0.65)",
              fontFamily: "'DM Sans',sans-serif",
              opacity: acting ? 0.6 : 1, transition: "all 0.15s",
            }}
          >
            {acting === "reject"
              ? <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(252,165,165,0.3)", borderTopColor: "#fca5a5", animation: "spin 0.7s linear infinite" }} />
              : <><UserX size={13} /> Decline</>
            }
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Request = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", { withCredentials: true });
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchRequest(); }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`${BASE_URL}/request/review/accepted/${requestId}`, {}, { withCredentials: true });
      dispatch(removeRequest(requestId));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`${BASE_URL}/request/review/rejected/${requestId}`, {}, { withCredentials: true });
      dispatch(removeRequest(requestId));
    } catch (err) { console.error(err); }
  };

  if (!requests) return null;

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{
        minHeight: "100vh", background: "#060614",
        fontFamily: "'DM Sans',sans-serif",
        position: "relative", overflowX: "hidden", paddingBottom: 80,
      }}>
        <StarCanvas />
<div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", top: -100, right: -100, filter: "blur(80px)" }} />
<div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)", bottom: 50, left: -100, filter: "blur(80px)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "40px 20px 0" }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#a5b4fc",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                padding: "4px 12px", borderRadius: 999,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block", boxShadow: "0 0 6px #818cf8" }} />
                Requests
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "clamp(22px,3vw,30px)",
                  fontWeight: 800, letterSpacing: "-1px",
                  color: "#fff", margin: 0, lineHeight: 1.1,
                }}>
                  Incoming{" "}
                  <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Requests
                  </span>
                </h1>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(148,163,184,0.4)" }}>
                  People who want to connect with you
                </p>
              </div>
              {requests.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.22)",
                  borderRadius: 999, padding: "6px 14px",
                  fontSize: 12, fontWeight: 600, color: "#fbbf24",
                }}>
                  <Clock size={13} /> {requests.length} pending
                </div>
              )}
            </div>
          </motion.div>

          {/* Empty state */}
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", paddingTop: 80, gap: 16,
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}>
                <Inbox size={28} style={{ color: "rgba(99,102,241,0.4)" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(148,163,184,0.5)" }}>
                  No pending requests
                </div>
                <div style={{ fontSize: 13, marginTop: 4, color: "rgba(148,163,184,0.3)" }}>
                  You're all caught up!
                </div>
              </div>
              <Link to="/discover" style={{ textDecoration: "none" }}>
                <button style={{
                  marginTop: 8, padding: "10px 24px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                }}>
                  Discover Developers
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div layout style={{
              display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
              gap: 20,
            }}>
              <AnimatePresence>
                {requests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Request;