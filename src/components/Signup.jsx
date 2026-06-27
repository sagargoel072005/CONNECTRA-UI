import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

/* ── Star canvas ── */
const StarCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.005,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,255,${s.a * 0.7})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

/* ── Floating orb ── */
const FloatingOrb = ({ size, color, className }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size, height: size,
      background: `radial-gradient(circle at 40% 40%, ${color}, transparent 70%)`,
      filter: "blur(60px)",
    }}
    animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ── Animated floating label input ── */
const FloatingInput = ({ label, type, value, onChange, icon, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;
  const active = focused || value.length > 0;

  return (
    <div className="relative mb-[18px]">
      {/* Gradient border */}
      <div
        className="absolute inset-[-1px] rounded-[14px] z-0 transition-all duration-300"
        style={{
          background: focused
            ? "linear-gradient(135deg, #6366f1, #8b5cf6, #60a5fa)"
            : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
          opacity: focused ? 1 : 0.6,
        }}
      />
      <div
        className="relative z-10 flex items-center rounded-[13px] backdrop-blur-md"
        style={{ background: "rgba(8,8,28,0.85)" }}
      >
        <span
          className="pl-4 pr-2 text-base flex-shrink-0 transition-colors duration-300"
          style={{ color: focused ? "#818cf8" : "rgba(148,163,184,0.5)" }}
        >
          {icon}
        </span>
        <div
          className="flex-1 relative flex items-center"
          style={{
            paddingTop: active ? 20 : 0,
            paddingBottom: active ? 6 : 0,
            minHeight: 52,
          }}
        >
          <motion.label
            animate={{
              top: active ? 8 : "50%",
              y: active ? 0 : "-50%",
              fontSize: active ? 10 : 14,
              color: focused ? "#818cf8" : "rgba(148,163,184,0.5)",
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 pointer-events-none font-medium"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: active ? "0.08em" : 0,
              textTransform: active ? "uppercase" : "none",
            }}
          >
            {label}
          </motion.label>
          <input
            type={inputType} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            className="w-full bg-transparent border-none outline-none text-slate-200 text-[15px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              paddingRight: isPassword ? 0 : 16,
              marginTop: active ? 2 : 0,
            }}
          />
        </div>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="bg-transparent border-none cursor-pointer px-3.5 flex-shrink-0 text-slate-400/50 hover:text-indigo-400 transition-colors duration-200"
          >
            {showPass ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════ SIGNUP PAGE ══════════════ */
const Signup = () => {
  const [emailId,   setEmailId]   = useState("");
  const [password,  setPassword]  = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!firstName || !lastName || !emailId || !password) { setError("All fields are required"); return; }
    try {
      setLoading(true); setError("");
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId: emailId.trim(), password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 600);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  const iconUser  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const iconEmail = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
  const iconLock  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .su-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 60px 60px; pointer-events: none; z-index: 0;
        }
        .su-blob {
          position: absolute; width: 320px; height: 320px;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15));
          filter: blur(2px); animation: suMorph 12s ease-in-out infinite;
        }
        @keyframes suMorph {
          0%,100%{ border-radius:30% 70% 70% 30%/30% 30% 70% 70%; transform:rotate(0deg) scale(1); }
          33%{ border-radius:70% 30% 30% 70%/70% 70% 30% 30%; transform:rotate(120deg) scale(1.05); }
          66%{ border-radius:50% 50% 70% 30%/50% 70% 30% 50%; transform:rotate(240deg) scale(0.97); }
        }
        .su-brand-orb::after {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          border: 1px solid rgba(99,102,241,0.4);
          animation: suOrbitPulse 2.5s ease-in-out infinite;
        }
        @keyframes suOrbitPulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.08);opacity:1} }
        .su-eyebrow-dot { animation: suEPulse 2s infinite; }
        @keyframes suEPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        .su-spinner {
          width:16px; height:16px; border-radius:50%;
          border:2px solid rgba(255,255,255,0.25); border-top-color:#fff;
          animation:suSpin 0.7s linear infinite; display:inline-block; flex-shrink:0;
        }
        @keyframes suSpin { to{transform:rotate(360deg)} }
        .su-submit-btn::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
          pointer-events:none;
        }
      `}</style>

      <div
        className="su-root min-h-screen flex items-center justify-center relative overflow-hidden p-6"
        style={{ background: "#060614", fontFamily: "'DM Sans', sans-serif" }}
      >
        <StarCanvas />
        <FloatingOrb size={500} color="rgba(99,102,241,0.12)" className="-top-36 -left-36 z-0" />
        <FloatingOrb size={400} color="rgba(139,92,246,0.1)"  className="-bottom-24 -right-24 z-0" />

        {/* Back button */}
        <button
          className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] text-white/60 hover:bg-white/[0.09] hover:text-white cursor-pointer rounded-[10px] px-3.5 py-2 text-[13px] transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

        {/* Card */}
        <motion.div
          className="relative z-10 w-full max-w-[960px] flex overflow-hidden rounded-[28px] border border-white/[0.08] backdrop-blur-2xl"
          style={{
            background: "rgba(8,8,28,0.8)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 32px 80px rgba(0,0,0,0.6), 0 0 120px rgba(99,102,241,0.08)",
            minHeight: 640,
          }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="absolute inset-0 z-20 rounded-[27px] flex items-center justify-center backdrop-blur-md"
                style={{ background: "rgba(8,8,28,0.9)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
                >
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[30px]"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #34d399)",
                      boxShadow: "0 0 50px rgba(52,211,153,0.5)",
                    }}
                  >
                    ✓
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── LEFT PANEL ── */}
          <div
            className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden border-r border-white/[0.06]"
            style={{
              background: "linear-gradient(145deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(6,6,20,0.95) 100%)",
            }}
          >
            <div className="su-blob" />
            <div className="relative z-[2] text-center px-12 py-10">
              {/* Brand orb */}
              <div
                className="su-brand-orb w-[100px] h-[100px] rounded-full flex items-center justify-center mx-auto mb-7 relative text-[40px] font-extrabold text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 50px rgba(99,102,241,0.5), 0 0 100px rgba(99,102,241,0.2)",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                C
              </div>

              <div
                className="text-[32px] font-extrabold text-white tracking-[-1px] mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Connectra
              </div>
              <div className="text-[15px] leading-[1.8] mb-10" style={{ color: "rgba(148,163,184,0.65)" }}>
                Connect.<br />Collaborate.<br />Grow.
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-4 text-left">
                {[
                  { num: "01", color: "#60a5fa", title: "Create your profile", desc: "Set up in under 2 minutes" },
                  { num: "02", color: "#a78bfa", title: "Find collaborators",  desc: "Match with 50k+ developers" },
                  { num: "03", color: "#34d399", title: "Ship together",       desc: "Build projects that matter" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3.5 rounded-[14px] px-4 py-3.5 border border-white/[0.07]"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.12 }}
                  >
                    <div
                      className="w-[26px] h-[26px] rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-extrabold mt-[1px]"
                      style={{
                        background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                        border: `1px solid ${s.color}44`,
                        color: s.color,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {s.num}
                    </div>
                    <div className="text-[13px] leading-[1.5]" style={{ color: "rgba(199,210,254,0.75)" }}>
                      <div className="font-semibold mb-0.5" style={{ color: "rgba(224,231,255,0.9)" }}>
                        {s.title}
                      </div>
                      {s.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex-[0_0_460px] max-md:flex-1 px-12 py-11 max-md:px-7 max-sm:px-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase mb-5 border w-fit"
              style={{
                background: "rgba(99,102,241,0.12)",
                borderColor: "rgba(99,102,241,0.25)",
                color: "#a5b4fc",
              }}
            >
              <span
                className="su-eyebrow-dot w-[5px] h-[5px] rounded-full"
                style={{ background: "#818cf8" }}
              />
              Join us today
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div
                className="text-[30px] font-extrabold text-white tracking-[-1px] leading-[1.1] mb-1.5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Create your<br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #818cf8, #a78bfa, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  account
                </span>
              </div>
              <div className="text-[13.5px] leading-[1.6] mb-7" style={{ color: "rgba(148,163,184,0.6)" }}>
                Join 50,000+ developers. Free forever for open source.
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <FloatingInput label="First Name" type="text"  value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name"  icon={iconUser} />
                <FloatingInput label="Last Name"  type="text"  value={lastName}  onChange={e => setLastName(e.target.value)}  autoComplete="family-name" icon={iconUser} />
              </div>

              <FloatingInput label="Email address" type="email"    value={emailId}  onChange={e => setEmailId(e.target.value)}  autoComplete="email"        icon={iconEmail} />
              <FloatingInput label="Password"      type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password"  icon={iconLock} />

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[13px] mb-4 border"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      borderColor: "rgba(239,68,68,0.2)",
                      color: "#fca5a5",
                    }}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                className="su-submit-btn w-full py-3.5 rounded-[13px] border-none text-white text-sm font-semibold cursor-pointer relative overflow-hidden flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-65 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 28px rgba(99,102,241,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 0 44px rgba(99,102,241,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(99,102,241,0.4)"; }}
                onClick={handleSignup}
                disabled={loading}
              >
                {loading
                  ? <><span className="su-spinner" /> Creating account…</>
                  : <>Create Account <span className="text-base">→</span></>
                }
              </button>

              {/* Terms */}
              <p
                className="text-center mt-3.5 text-[11.5px] leading-[1.6]"
                style={{ color: "rgba(148,163,184,0.4)" }}
              >
                By signing up, you agree to our{" "}
                <a href="/terms"   className="underline" style={{ color: "rgba(129,140,248,0.6)" }}>Terms of Service</a> and{" "}
                <a href="/privacy" className="underline" style={{ color: "rgba(129,140,248,0.6)" }}>Privacy Policy</a>.
              </p>

              {/* Switch link */}
              <div
                className="text-center mt-5 text-[13px]"
                style={{ color: "rgba(148,163,184,0.55)" }}
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-[13px] underline underline-offset-[3px] transition-colors duration-200"
                  style={{ color: "#818cf8", textDecorationColor: "rgba(129,140,248,0.4)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#a5b4fc")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#818cf8")}
                >
                  Sign in
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;