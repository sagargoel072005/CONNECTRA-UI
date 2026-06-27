import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Users, Code2, ShieldCheck, FolderGit2,
  Network, Laptop2, Share2, Zap, Globe, Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Counter = ({ to, suffix = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return controls.stop;
  }, [to, suffix]);
  return <span ref={ref}>0</span>;
};

const StarCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2, a: Math.random(),
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

const OrbitRing = ({ radius, duration, icons, colorClass }) => (
  <div className="absolute" style={{ width: radius * 2, height: radius * 2, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
    {icons.map((Icon, i) => (
      <motion.div key={i} className="absolute"
        style={{ top: "50%", left: "50%", width: 40, height: 40, marginTop: -20, marginLeft: -20 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear", delay: -(duration / icons.length) * i }}
      >
        <motion.div className="absolute flex items-center justify-center rounded-[10px] backdrop-blur-sm"
          style={{ top: -radius, left: "50%", marginLeft: -20, width: 40, height: 40, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration, ease: "linear", delay: -(duration / icons.length) * i }}
        >
          <Icon size={18} className={colorClass} />
        </motion.div>
      </motion.div>
    ))}
  </div>
);

const TiltCard = ({ children, className, style }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={className}
    >{children}</motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const features = [
    { icon: Network, title: "Developer Networking", desc: "Connect with 50k+ developers across 120 countries. Find collaborators, mentors, and friends in tech.", accent: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    { icon: FolderGit2, title: "Project Collaboration", desc: "Build in public. Fork ideas, open PRs, and ship products together with your global team.", accent: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
    { icon: ShieldCheck, title: "Secure Platform", desc: "Enterprise-grade encryption, 2FA, and privacy controls baked in from day one.", accent: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
    { icon: Globe, title: "Global Discovery", desc: "Trending repos, featured devs, and real-time activity feeds curated just for you.", accent: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)" },
    { icon: Zap, title: "Real-time Collab", desc: "Live cursors, instant messaging, and co-editing tools that keep teams in sync.", accent: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
    { icon: Lock, title: "Private Spaces", desc: "Invite-only rooms for stealth projects, secure code reviews, and NDA-protected work.", accent: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)" },
  ];

const [developerCount, setDeveloperCount] = useState(0);

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/stats`)
    .then(res => res.json())
    .then(data => setDeveloperCount(data.developers))
    .catch(() => setDeveloperCount(0));
}, []);

const stats = [
  { value: developerCount || 50, suffix: "+", label: "Developers" }, // ✅ Live from DB
  { value: 100,            suffix: "+", label: "Projects" },
  { value: 1,            suffix: "", label: "Countries" },
  { value: 98,             suffix: "%", label: "Uptime" },
];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 14 } } };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .lp-grid-bg::before {
          content: ''; position: fixed; inset: 0;
          background-image: linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 60px 60px; pointer-events: none; z-index: 0;
        }
        .lp-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); opacity: 0.4; }
        .lp-pulse { animation: lpPulse 2s infinite; }
        @keyframes lpPulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
        .lp-grad-text { background: linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .lp-stat-grad { background: linear-gradient(135deg, #e0e7ff, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .lp-feat-title-grad { background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .lp-feat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; opacity: 0; transition: opacity 0.25s; }
        .lp-feat-card:hover::before { opacity: 1; }
        .lp-orbit-dashed { border: 1px dashed rgba(255,255,255,0.07); }
        .lp-banner::before { content: ''; position: absolute; inset: 0; border-radius: 24px; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%); pointer-events: none; }
        .lp-ham span { display: block; width: 20px; height: 2px; background: rgba(255,255,255,0.6); border-radius: 2px; transition: all 0.25s; }
        .lp-ham.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .lp-ham.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .lp-ham.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
      `}</style>

      <div className="lp-grid-bg font-dm relative min-h-screen overflow-x-hidden" style={{ background: "#060614", color: "#e2e8f0" }}>
        <StarCanvas />
        <div className="lp-noise fixed inset-0 pointer-events-none z-0" />

        {/* Glow orbs */}
        {/* Glow orbs */}
<div className="absolute inset-0 pointer-events-none z-0">
  <div className="absolute rounded-full" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", top: -200, left: -200, filter: "blur(60px)" }} />
  <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", bottom: -150, right: -150, filter: "blur(60px)" }} />
</div>


        {/* ── NAV ── */}
        <nav className="relative z-10 backdrop-blur-xl" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(6,6,20,0.6)" }}>
          <div className="flex justify-between items-center px-5 sm:px-10 lg:px-20 py-4 sm:py-5">
            <div className="font-syne text-[20px] sm:text-[22px] font-extrabold text-white flex items-center gap-2.5 tracking-tight">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#6366f1", boxShadow: "0 0 12px #6366f1" }} />
              Connectra
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="font-dm text-[13px] font-medium px-4 py-2 rounded-[10px] transition-all duration-200 cursor-pointer"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onClick={() => navigate("/about-us")}
              >About</button>
              
              <button className="font-dm text-[13px] font-semibold px-5 py-2 rounded-[10px] text-white border-none cursor-pointer transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.55)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.35)"; }}
                onClick={() => navigate("/login")}
              >Sign In →</button>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`lp-ham sm:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 ${mobileMenu ? "open" : ""}`}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <span /><span /><span />
            </button>
          </div>

          {/* Mobile menu drawer */}
          {mobileMenu && (
            <div className="sm:hidden flex flex-col gap-2 px-5 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(6,6,20,0.97)" }}>
              <button className="text-left py-3 text-sm font-medium border-none bg-transparent cursor-pointer" style={{ color: "rgba(255,255,255,0.7)" }} onClick={() => { navigate("/about"); setMobileMenu(false); }}>About</button>
              <button className="text-left py-3 text-sm font-medium border-none bg-transparent cursor-pointer" style={{ color: "rgba(255,255,255,0.7)" }} onClick={() => { navigate("/features"); setMobileMenu(false); }}>Features</button>
              <button className="w-full py-3 rounded-xl text-white text-sm font-semibold border-none cursor-pointer mt-1" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} onClick={() => { navigate("/login"); setMobileMenu(false); }}>Sign In →</button>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section className="relative z-[1] flex flex-col lg:flex-row items-center justify-between px-5 sm:px-10 lg:px-20 pt-14 sm:pt-20 lg:pt-[100px] pb-16 gap-10 lg:gap-[60px]">
          <motion.div className="flex-1 max-w-full lg:max-w-[560px] w-full"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden" animate="show"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-[20px] px-[14px] py-[5px] text-[11px] font-medium tracking-widest uppercase mb-6"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
              >
                <span className="lp-pulse w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#818cf8" }} />
                Now in Public Beta
              </div>
            </motion.div>

            <motion.h1 className="font-syne font-extrabold text-white mb-5"
              style={{ fontSize: "clamp(36px, 8vw, 68px)", lineHeight: 1.05, letterSpacing: "-2px" }}
              variants={fadeUp}
            >
              Where Builders
              <span className="lp-grad-text block">Connect & Ship</span>
            </motion.h1>

            <motion.p className="text-[15px] sm:text-[16px] mb-8 max-w-full lg:max-w-[460px]"
              style={{ color: "rgba(148,163,184,0.85)", lineHeight: 1.75 }}
              variants={fadeUp}
            >
              Connectra is the professional network built for developers — discover collaborators, showcase your work, and build the future together.
            </motion.p>

            <motion.div className="flex gap-3 flex-wrap" variants={fadeUp}>
              <button className="font-dm text-[14px] font-semibold text-white px-6 sm:px-8 py-[13px] rounded-xl border-none cursor-pointer flex items-center gap-2 transition-all duration-[250ms]"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 28px rgba(99,102,241,0.4)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(99,102,241,0.4)"; }}
                onClick={() => navigate("/signup")}
              >Get Started Free <span className="text-[16px]">→</span></button>
              
            </motion.div>
          </motion.div>

          {/* ORBIT GRAPHIC — hidden on small mobile, shown md+ */}
          <motion.div className="hidden sm:flex flex-1 justify-center items-center relative max-w-[340px] lg:max-w-[440px] w-full"
            style={{ height: 340 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1.2, delay: 0.3 }}
          >
            {[160, 250, 330].map((d, i) => (
              <div key={i} className="absolute lp-orbit-dashed rounded-full"
                style={{ width: d, height: d, top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.5 - i * 0.12 }}
              />
            ))}
            <OrbitRing radius={82} duration={10} icons={[Code2, Users]} colorClass="text-blue-400" />
            <OrbitRing radius={128} duration={16} icons={[Network, Share2, Laptop2]} colorClass="text-violet-400" />
            <div className="absolute w-[100px] h-[100px] rounded-full flex items-center justify-center backdrop-blur-xl"
              style={{ background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.6), rgba(139,92,246,0.3))", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 0 60px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)" }}
            >
              <Users size={38} style={{ color: "#818cf8" }} />
            </div>
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <motion.div
          className="relative z-[1] grid grid-cols-2 sm:grid-cols-4"
          style={{ gap: "1px", background: "rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {stats.map((s, i) => (
            <motion.div key={i} className="text-center px-4 py-8 sm:px-6 sm:py-9"
              style={{ background: "rgba(6,6,20,0.9)" }}
              variants={fadeUp}
            >
              {/* min-w-0 + overflow visible fix for number cutoff */}
              <div className="lp-stat-grad font-syne font-extrabold overflow-visible"
                style={{ fontSize: "clamp(28px, 6vw, 38px)", letterSpacing: "-1.5px" }}
              >
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[11px] sm:text-[12px] mt-1 font-medium uppercase tracking-wider"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FEATURES ── */}
        <section className="relative z-[1] px-5 sm:px-10 lg:px-20 py-16 sm:py-[100px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "#818cf8" }}>Everything you need</div>
            <div className="font-syne font-extrabold text-white mb-10 sm:mb-16 max-w-full lg:max-w-[560px]"
              style={{ fontSize: "clamp(24px, 5vw, 44px)", letterSpacing: "-1.5px", lineHeight: 1.1 }}
            >
              Built for how{" "}
              <span className="lp-feat-title-grad">developers actually work</span>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <TiltCard
                  className="lp-feat-card relative overflow-hidden rounded-[20px] p-6 sm:p-8 cursor-default transition-all duration-[250ms]"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                    <f.icon size={22} style={{ color: f.accent }} />
                  </div>
                  <div className="font-syne font-bold text-[16px] sm:text-[17px] mb-2.5" style={{ color: "#e2e8f0", letterSpacing: "-0.3px" }}>{f.title}</div>
                  <div className="text-[13px] sm:text-[13.5px]" style={{ color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>{f.desc}</div>
                  <style>{`.lp-feat-card:nth-child(${i + 1})::before { background: linear-gradient(90deg, transparent, ${f.accent}66, transparent); }`}</style>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── CTA BANNER ── */}
        <motion.div
          className="lp-banner relative z-[1] mx-5 sm:mx-10 lg:mx-20 mb-16 sm:mb-[100px] rounded-[20px] sm:rounded-[24px] px-6 sm:px-[60px] py-10 sm:py-16 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)", border: "1px solid rgba(99,102,241,0.25)" }}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
        >
          <div className="font-syne font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(22px, 5vw, 42px)", letterSpacing: "-1.5px", lineHeight: 1.1 }}
          >Ready to build together?</div>
          <div className="text-[14px] sm:text-[15px] mb-8 max-w-[480px] mx-auto" style={{ color: "rgba(199,210,254,0.7)", lineHeight: 1.7 }}>
            Join 50,000+ developers already on Connectra. Free forever for open source.
          </div>
          <button className="font-dm text-[14px] font-semibold text-white px-7 sm:px-8 py-[13px] sm:py-[14px] rounded-xl border-none cursor-pointer inline-flex items-center gap-2 transition-all duration-[250ms] mx-auto"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 28px rgba(99,102,241,0.4)" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(99,102,241,0.4)"; }}
            onClick={() => navigate("/signup")}
          >Create your profile <span className="text-[16px]">→</span></button>
        </motion.div>

        {/* ── FOOTER ── */}
        <footer className="relative z-[1] px-5 sm:px-10 lg:px-20 py-7 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="font-syne text-[16px] font-extrabold flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#6366f1", boxShadow: "0 0 12px #6366f1" }} />
            Connectra
          </div>
          <div className="text-[12px]" style={{ color: "rgba(148,163,184,0.35)" }}>© 2026 Connectra. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;