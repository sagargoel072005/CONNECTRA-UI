import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound, Users, UserPlus2,
  Gem, Newspaper, LogOut, ChevronDown, Rss, Compass,
  MessageCircle, X, Search, FileText,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/feed",        label: "Feed",        icon: Rss },
  { to: "/discover",   label: "Discover",    icon: Compass },
  { to: "/connections", label: "Connections", icon: Users },
  { to: "/requests",    label: "Requests",    icon: UserPlus2 },
  { to: "/premium",     label: "Premium",     icon: Gem },
  { to: "/tech-news",   label: "Tech News",   icon: Newspaper },
];

/* ── Chat Drawer ── */
const ChatDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
        setConnections(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [open]);

  const filtered = connections.filter((u) => {
    const q = search.toLowerCase();
    return !q || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q);
  });

  const handleChat = (userId) => {
    onClose();
    navigate(`/chat/${userId}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full z-[201] flex flex-col"
            style={{
              width: "min(380px, 100vw)",
              background: "rgba(8,6,24,0.98)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={16} style={{ color: "#818cf8" }} />
                <span
                  className="text-white font-bold text-[15px]"
                  style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}
                >
                  Messages
                </span>
                {connections.length > 0 && (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(124,58,237,0.2)",
                      border: "1px solid rgba(124,58,237,0.3)",
                      color: "#a5b4fc",
                    }}
                  >
                    {connections.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-all duration-150"
                style={{ color: "rgba(148,163,184,0.5)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e2e8f0";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(148,163,184,0.5)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(148,163,184,0.35)" }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search connections…"
                  className="w-full rounded-xl text-sm outline-none pl-8 pr-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#e2e8f0",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div
                    className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(124,58,237,0.2)", borderTopColor: "#818cf8" }}
                  />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.12)" }}
                  >
                    <MessageCircle size={22} style={{ color: "rgba(99,102,241,0.4)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "rgba(148,163,184,0.4)" }}>
                    {search ? "No results found" : "No connections yet"}
                  </p>
                </div>
              ) : (
                filtered.map((u) => {
                  const displayName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
                  const initials = `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();
                  return (
                    <button
                      key={u._id}
                      onClick={() => handleChat(u._id)}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 border-none text-left cursor-pointer"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {u.photoUrl ? (
                          <img
                            src={u.photoUrl}
                            alt={displayName}
                            className="w-11 h-11 rounded-full object-cover"
                            style={{ border: "2px solid rgba(99,102,241,0.25)" }}
                          />
                        ) : (
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{
                              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                              border: "2px solid rgba(99,102,241,0.25)",
                            }}
                          >
                            {initials}
                          </div>
                        )}
                        {/* Online dot */}
                        <span
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400"
                          style={{ border: "2px solid rgba(8,6,24,1)" }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {displayName}
                        </p>
                        <p
                          className="text-xs truncate mt-0.5"
                          style={{ color: "rgba(148,163,184,0.45)" }}
                        >
                          {u.about?.slice(0, 35) || u.company || "Tap to chat"}
                        </p>
                      </div>

                      {/* Arrow */}
                      <MessageCircle size={14} style={{ color: "rgba(124,58,237,0.4)", flexShrink: 0 }} />
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const user     = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open,        setOpen]        = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileMenu,  setMobileMenu]  = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .cnav-link-active::after {
          content: '';
          position: absolute; bottom: -1px; left: 14px; right: 14px;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #7c3aed, #6366f1);
        }

        .ham-open .ham-line-1 { transform: translateY(7px) rotate(45deg); }
        .ham-open .ham-line-2 { opacity: 0; transform: scaleX(0); }
        .ham-open .ham-line-3 { transform: translateY(-7px) rotate(-45deg); }

        .nav-logo-d {
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 60%, #4f46e5 100%);
          box-shadow: 0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(99,102,241,0.2);
        }

        .discover-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          color: white;
          padding: 1px 5px;
          border-radius: 4px;
          margin-left: 2px;
          vertical-align: middle;
          text-transform: uppercase;
        }

        .chat-nav-btn:hover {
          background: rgba(124,58,237,0.12) !important;
          border-color: rgba(124,58,237,0.3) !important;
          color: #a5b4fc !important;
        }
      `}</style>

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />

      <nav
        className="sticky top-0 z-[100] transition-all duration-300 border-b border-white/[0.06] backdrop-blur-xl"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: scrolled ? "rgba(5,4,18,0.95)" : "rgba(5,4,18,0.78)",
          boxShadow: scrolled
            ? "0 0 0 1px rgba(124,58,237,0.12), 0 8px 32px rgba(0,0,0,0.45)"
            : "none",
        }}
      >
<div className="max-w-[1280px] mx-auto px-4 sm:px-7 h-[62px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div
              className="nav-logo-d w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 text-white text-[15px] font-extrabold"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              C
            </div>
            <span
              className="text-[18px] font-extrabold tracking-[-0.5px]"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(90deg, #e0e7ff 30%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Connectra
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-[10px] no-underline text-[13px] font-medium transition-all duration-200 whitespace-nowrap relative
                  ${isActive(to)
                    ? "cnav-link-active text-[#a5b4fc] bg-[rgba(124,58,237,0.12)]"
                    : "text-slate-400/70 hover:text-slate-200 hover:bg-white/[0.05]"
                  }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5 flex-shrink-0">

            {/* Chat icon button */}
            {user && (
              <button
                className="chat-nav-btn flex items-center justify-center w-9 h-9 rounded-[10px] border transition-all duration-200 cursor-pointer relative"
                style={{
                  background: chatOpen ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.04)",
                  border: chatOpen ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  color: chatOpen ? "#a5b4fc" : "rgba(148,163,184,0.6)",
                }}
                onClick={() => setChatOpen(true)}
                title="Messages"
              >
                <MessageCircle size={16} />
              </button>
            )}

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2.5 border border-white/10 rounded-xl px-2.5 py-[5px] pl-[5px] cursor-pointer transition-all duration-200 hover:border-[rgba(124,58,237,0.35)]"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(124,58,237,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => setOpen(!open)}
                >
                  <div className="relative">
                    <img
                      className="w-8 h-8 rounded-lg object-cover border border-white/[0.12]"
                      src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                      alt={user.firstName}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full bg-emerald-400"
                      style={{ border: "2px solid rgba(5,4,18,1)" }}
                    />
                  </div>

                  <span className="hidden sm:block text-[13px] font-semibold text-slate-200 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.firstName}
                  </span>

                  <ChevronDown
                    size={13}
                    className="text-slate-400/50 transition-transform duration-[250ms]"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      className="absolute right-0 top-[calc(100%+10px)] w-[220px] rounded-[18px] overflow-hidden p-2 border border-white/[0.08] backdrop-blur-2xl"
                      style={{
                        background: "rgba(8,6,24,0.97)",
                        boxShadow: "0 0 0 1px rgba(124,58,237,0.14), 0 24px 48px rgba(0,0,0,0.6)",
                      }}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {/* User info */}
                      <div className="px-3 pt-2.5 pb-3 border-b border-white/[0.06] mb-1.5">
                        <div
                          className="text-[14px] font-bold text-slate-200 tracking-[-0.3px]"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-[11px] mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ color: "rgba(148,163,184,0.45)" }}>
                          {user.emailId || "Connectra member"}
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] no-underline text-[13px] font-medium transition-all duration-150 w-full text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        onClick={() => setOpen(false)}
                      >
                        <UserRound size={14} />
                        My Profile
                      </Link>

                      <Link
                        to="/resume-builder"
                        className={`flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] no-underline text-[13px] font-medium transition-all duration-150 w-full
                          ${isActive("/resume-builder")
                            ? "text-[#a5b4fc] bg-[rgba(124,58,237,0.1)]"
                            : "text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05]"
                          }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        onClick={() => setOpen(false)}
                      >
                        <FileText size={14} />
                        Resume Builder
                      </Link>

                      {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          className={`flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] no-underline text-[13px] font-medium transition-all duration-150 w-full
                            ${isActive(to)
                              ? "text-[#a5b4fc] bg-[rgba(124,58,237,0.1)]"
                              : "text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05]"
                            }`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          onClick={() => setOpen(false)}
                        >
                          <Icon size={14} />
                          {label}
                        </Link>
                      ))}

                      <div className="h-px my-1.5" style={{ background: "rgba(255,255,255,0.06)" }} />

                      <button
                        className="flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] text-[13px] font-medium w-full text-left border-none bg-transparent cursor-pointer transition-all duration-150"
                        style={{ color: "rgba(252,165,165,0.7)", fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#fca5a5";
                          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(252,165,165,0.7)";
                          e.currentTarget.style.background = "transparent";
                        }}
                        onClick={handleLogout}
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className={`flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1.5 ${mobileMenu ? "ham-open" : ""}`}
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Menu"
            >
              <div className="ham-line-1 w-5 h-0.5 rounded-sm bg-slate-400/70 transition-all duration-[250ms]" />
              <div className="ham-line-2 w-5 h-0.5 rounded-sm bg-slate-400/70 transition-all duration-[250ms]" />
              <div className="ham-line-3 w-5 h-0.5 rounded-sm bg-slate-400/70 transition-all duration-[250ms]" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              className="border-t border-white/[0.06] flex flex-col gap-1 px-4 pt-3 pb-5 backdrop-blur-xl"
              style={{ background: "rgba(5,4,18,0.98)" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl no-underline text-[14px] font-medium text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-150"
                onClick={() => setMobileMenu(false)}
              >
                <UserRound size={15} />
                My Profile
              </Link>

              <Link
                to="/resume-builder"
                className="flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl no-underline text-[14px] font-medium text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-150"
                onClick={() => setMobileMenu(false)}
              >
                <FileText size={15} />
                Resume Builder
              </Link>

              {/* Chat in mobile menu */}
              <button
                className="flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl text-[14px] font-medium text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-150 border-none bg-transparent cursor-pointer w-full text-left"
                onClick={() => { setMobileMenu(false); setChatOpen(true); }}
              >
                <MessageCircle size={15} />
                Messages
              </button>

              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl no-underline text-[14px] font-medium transition-all duration-150
                    ${isActive(to)
                      ? "text-[#a5b4fc] bg-[rgba(124,58,237,0.1)]"
                      : "text-slate-400/75 hover:text-slate-200 hover:bg-white/[0.05]"
                    }`}
                  onClick={() => setMobileMenu(false)}
                >
                  <Icon size={15} />
                  {label}
                  </Link>
              ))}

              <div className="h-px my-1.5" style={{ background: "rgba(255,255,255,0.06)" }} />

              <button
                className="flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl text-[14px] font-medium border-none bg-transparent cursor-pointer w-full text-left transition-all duration-150"
                style={{ color: "rgba(252,165,165,0.7)", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fca5a5";
                  e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(252,165,165,0.7)";
                  e.currentTarget.style.background = "transparent";
                }}
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;