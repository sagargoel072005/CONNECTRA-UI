import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper, ExternalLink, RefreshCw, Clock, Search,
  Cpu, Zap, Globe, TrendingUp, Layers, ChevronRight,
  WifiOff, BookOpen,
} from "lucide-react";

/* ─────────────────────────────────────
   STAR CANVAS
───────────────────────────────────── */
const StarCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2, a: Math.random(),
      da: (Math.random() - 0.5) * 0.003,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,255,${s.a * 0.45})`; ctx.fill();
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

/* ─────────────────────────────────────
   CONFIG  –  GNews API (free: 100 req/day, CORS-friendly)
   Get your key → https://gnews.io
───────────────────────────────────── */
import { BASE_URL } from "../utils/constants";

const CATEGORIES = [
  { id: "technology", label: "All Tech",  icon: <Cpu size={13} /> },
  { id: "ai",         label: "AI",        icon: <Zap size={13} /> },
  { id: "science",    label: "Science",   icon: <Layers size={13} /> },
  { id: "business",   label: "Business",  icon: <TrendingUp size={13} /> },
  { id: "world",      label: "World",     icon: <Globe size={13} /> },
];

// GNews supports these native categories for /top-headlines
const GNEWS_NATIVE = ["technology", "science", "business", "world"];

// Keyword queries for non-native tabs (like "ai")
const CATEGORY_QUERY = {
  ai: "artificial intelligence OR machine learning OR LLM",
};

const CAT_ACCENT = {
  technology: "99,102,241",
  ai:         "139,92,246",
  science:    "52,211,153",
  business:   "251,191,36",
  world:      "96,165,250",
};

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ─────────────────────────────────────
   SKELETON CARD
───────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden mb-3 animate-pulse"
    style={{ background: "rgba(8,8,28,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
  >
    <div className="p-5 flex gap-4">
      <div className="rounded-xl flex-shrink-0" style={{ width: 80, height: 80, background: "rgba(255,255,255,0.05)" }} />
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.06)", width: "30%" }} />
        <div className="h-4 rounded-full" style={{ background: "rgba(255,255,255,0.08)", width: "90%" }} />
        <div className="h-4 rounded-full" style={{ background: "rgba(255,255,255,0.06)", width: "70%" }} />
        <div className="h-3 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.04)", width: "50%" }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────
   NEWS CARD
───────────────────────────────────── */
const NewsCard = ({ article, accent, index }) => {
  const src = article.source?.name || "Unknown";
  const img = article.image;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noreferrer noopener"
      className="block rounded-2xl overflow-hidden mb-3 no-underline group"
      style={{
        background: "rgba(8,8,28,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.04), 0 8px 24px rgba(0,0,0,0.3)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 16, delay: index * 0.04 }}
      whileHover={{ scale: 1.005, borderColor: `rgba(${accent},0.25)` }}
    >
      <div className="flex gap-0">
        {img && !imgError ? (
          <div className="flex-shrink-0 relative overflow-hidden" style={{ width: 120, minHeight: 110 }}>
            <img
              src={img} alt={article.title}
              className="w-full h-full object-cover"
              style={{ minHeight: 110 }}
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 70%, rgba(8,8,28,0.6))" }} />
          </div>
        ) : (
          <div className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 80, background: `rgba(${accent},0.06)`, borderRight: `1px solid rgba(${accent},0.1)` }}>
            <Newspaper size={22} style={{ color: `rgba(${accent},0.45)` }} />
          </div>
        )}

        <div className="flex-1 min-w-0 p-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: `rgba(${accent},0.12)`, color: `rgba(${accent},1)`, border: `1px solid rgba(${accent},0.2)` }}>
              {src}
            </span>
            <span className="text-[11px] flex items-center gap-1" style={{ color: "rgba(148,163,184,0.4)" }}>
              <Clock size={10} /> {timeAgo(article.publishedAt)}
            </span>
          </div>

          <h3 className="text-sm font-semibold leading-snug"
            style={{ fontFamily: "'Syne',sans-serif", color: "rgba(226,232,240,0.9)", letterSpacing: "-0.2px" }}>
            {article.title?.replace(/ - .*$/, "")}
          </h3>

          {article.description && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(148,163,184,0.5)" }}>
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-1 mt-auto pt-1">
            <ChevronRight size={11} style={{ color: `rgba(${accent},0.6)` }} />
            <span className="text-[11px] font-medium group-hover:underline" style={{ color: `rgba(${accent},0.7)` }}>
              Read full article
            </span>
            <ExternalLink size={10} className="ml-0.5" style={{ color: `rgba(${accent},0.5)` }} />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

/* ─────────────────────────────────────
   STAT PILL
───────────────────────────────────── */
const StatPill = ({ value, label, color }) => (
  <div className="text-center flex-1 rounded-2xl py-3 px-4"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minWidth: 70 }}>
    <div className="font-extrabold tracking-tight" style={{
      fontFamily: "'Syne',sans-serif", fontSize: 22,
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>{value}</div>
    <div className="uppercase mt-0.5 tracking-widest"
      style={{ fontSize: 9, color: "rgba(148,163,184,0.4)", fontWeight: 600 }}>{label}</div>
  </div>
);

/* ═══════════════════════════════════════
   TECH NEWS PAGE
═══════════════════════════════════════ */
const TechNews = () => {
  const [articles, setArticles]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [activeTab, setActiveTab]     = useState("technology");
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [online, setOnline]           = useState(navigator.onLine);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef(null); // tracks in-flight request, cancels stale ones

  const PER_PAGE = 10;

  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // cancel any pending request on unmount (covers StrictMode double-mount too)
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  /* ── Build GNews URL ── */
// AB — BASE_URL apna import kar

const buildUrl = (cat, q, pg) => {
  const params = new URLSearchParams({ page: pg });
  if (q)                    params.set("q", q);
  else if (CATEGORY_QUERY[cat]) params.set("q", CATEGORY_QUERY[cat]);
  else                      params.set("category", cat);
  return `${BASE_URL}/api/news?${params}`;
};

  /* ── Fetch ── */
  const fetchNews = useCallback(async (cat, q, pg = 1, append = false) => {

    // cancel previous in-flight request before starting a new one
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!append) setLoading(true);
    else setLoadingMore(true);
    setError("");

    try {
      const url = buildUrl(cat, q, pg);
      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.errors?.[0] || `API error ${res.status}`);
      }

      const data = await res.json();
      // GNews returns { totalArticles, articles }
      const incoming = data.articles ?? [];

      if (incoming.length === 0) {
        if (!append) setArticles([]);
        setHasMore(false);
        return;
      }

      setArticles(prev => append ? [...prev, ...incoming] : incoming);
      setHasMore(incoming.length === PER_PAGE);
      setLastUpdated(new Date());
    } catch (err) {
      if (err.name === "AbortError") return; // stale request cancelled, ignore silently
      setError(err.message || "Failed to fetch news");
      if (!append) setArticles([]);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNews(activeTab, search, 1, false);
  }, [activeTab, search, fetchNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setActiveTab("technology");
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNews(activeTab, search, next, true);
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchNews(activeTab, search, 1, false);
  };

  const accent = CAT_ACCENT[activeTab] || "99,102,241";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .tn-root::before {
          content:''; position:fixed; inset:0;
          background-image: linear-gradient(rgba(99,102,241,0.025) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(99,102,241,0.025) 1px,transparent 1px);
          background-size:60px 60px; pointer-events:none; z-index:0;
        }
        .tab-active { background:linear-gradient(135deg,#6366f1,#8b5cf6)!important; color:#fff!important; box-shadow:0 0 16px rgba(99,102,241,0.3); }
        .tab-inactive:hover { background:rgba(255,255,255,0.06)!important; color:#e2e8f0!important; }
        .tn-search-wrap:focus-within { border-color:rgba(99,102,241,0.5)!important; box-shadow:0 0 0 2px rgba(99,102,241,0.15); }
        .load-more-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 0 24px rgba(99,102,241,0.4)!important; }
        .load-more-btn:disabled { opacity:.5; cursor:not-allowed; }
        .refresh-btn { transition:transform 0.5s ease; }
        .refresh-btn:hover { transform:rotate(180deg); }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      <div className="tn-root relative min-h-screen overflow-x-hidden pb-24"
        style={{ background: "#060614", fontFamily: "'DM Sans',sans-serif" }}>
        <StarCanvas />

        {/* BG orbs */}
      <div className="absolute rounded-full pointer-events-none z-0" style={{ width:500,height:500,background:"radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)",top:-100,right:-100,filter:"blur(80px)" }} />
<div className="absolute rounded-full pointer-events-none z-0" style={{ width:400,height:400,background:"radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)",bottom:50,left:-100,filter:"blur(80px)" }} />
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-7 pt-10">

          {/* ── HERO CARD ── */}
          <motion.div className="rounded-3xl overflow-hidden mb-5"
            style={{ border:"1px solid rgba(255,255,255,0.07)",background:"rgba(8,8,28,0.7)",backdropFilter:"blur(20px)",boxShadow:"0 0 0 1px rgba(99,102,241,0.08),0 24px 64px rgba(0,0,0,0.5)" }}
            initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ type:"spring",stiffness:60,damping:16 }}
          >
            {/* Header banner */}
            <div className="relative overflow-hidden px-8 pt-7 pb-6"
              style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",backgroundSize:"30px 30px" }} />

              <div className="relative flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                      <Newspaper size={18} color="#fff" />
                    </div>
                    <h1 className="font-extrabold text-white"
                      style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(20px,3vw,28px)",letterSpacing:"-1px" }}>
                      Tech News
                    </h1>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold"
                      style={{ background:online?"rgba(52,211,153,0.15)":"rgba(239,68,68,0.15)", border:`1px solid ${online?"rgba(52,211,153,0.3)":"rgba(239,68,68,0.3)"}`, color:online?"#34d399":"#f87171" }}>
                      {online
                        ? <><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live</>
                        : <><WifiOff size={10}/>Offline</>}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color:"rgba(148,163,184,0.5)" }}>
                    Real-time headlines via <span style={{ color:"#818cf8" }}>GNews API</span>
                    {lastUpdated && <span className="ml-2">· Updated {timeAgo(lastUpdated)}</span>}
                  </p>
                </div>

                <button onClick={handleRefresh} disabled={loading}
                  className="refresh-btn flex items-center gap-2 px-4 py-2 rounded-xl border-none cursor-pointer text-sm font-semibold"
                  style={{ background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.25)",color:"#a5b4fc" }}>
                  <RefreshCw size={14} className={loading?"animate-spin":""} />
                  Refresh
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-3 mt-5 flex-wrap">
                <StatPill value={articles.length} label="Loaded"   color="#818cf8" />
                <StatPill value={CATEGORIES.length} label="Topics" color="#34d399" />
                <StatPill value={lastUpdated?"✓":"–"} label="Synced" color="#60a5fa" />
                <StatPill value="EN" label="Language" color="#fbbf24" />
              </div>
            </div>

            {/* Search + Tabs */}
            <div className="px-7 py-5">
              <form onSubmit={handleSearch} className="flex gap-2 mb-5">
                <div className="tn-search-wrap flex-1 flex items-center gap-2 rounded-xl px-4"
                  style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",transition:"all 0.2s" }}>
                  <Search size={15} style={{ color:"rgba(148,163,184,0.4)",flexShrink:0 }} />
                  <input
                    type="text" value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search tech topics… (e.g. OpenAI, Apple, GPU)"
                    className="flex-1 bg-transparent border-none outline-none text-sm py-3"
                    style={{ color:"#e2e8f0",fontFamily:"'DM Sans',sans-serif" }}
                  />
                  {searchInput && (
                    <button type="button" onClick={() => { setSearchInput(""); setSearch(""); }}
                      className="bg-transparent border-none cursor-pointer" style={{ color:"rgba(148,163,184,0.4)" }}>✕</button>
                  )}
                </div>
                <button type="submit"
                  className="px-5 py-2.5 rounded-xl border-none text-white text-sm font-semibold cursor-pointer"
                  style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",fontFamily:"'DM Sans',sans-serif" }}>
                  Search
                </button>
              </form>

              {!search ? (
                <div className="flex flex-wrap gap-1 rounded-xl p-1 w-fit"
                  style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)" }}>
                  {CATEGORIES.map(tab => (
                    <button key={tab.id}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] text-[12px] font-semibold cursor-pointer border-none capitalize tracking-wide transition-all duration-200 ${activeTab===tab.id?"tab-active":"tab-inactive"}`}
                      style={{ fontFamily:"'DM Sans',sans-serif", color:activeTab===tab.id?"#fff":"rgba(148,163,184,0.55)", background:activeTab===tab.id?undefined:"transparent" }}
                      onClick={() => { setActiveTab(tab.id); setSearch(""); setSearchInput(""); }}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color:"rgba(148,163,184,0.5)" }}>Results for:</span>
                  <span className="px-3 py-1 rounded-xl text-sm font-semibold"
                    style={{ background:`rgba(${accent},0.12)`,color:`rgba(${accent},1)`,border:`1px solid rgba(${accent},0.2)` }}>
                    "{search}"
                  </span>
                  <button onClick={() => { setSearch(""); setSearchInput(""); }}
                    className="text-xs bg-transparent border-none cursor-pointer" style={{ color:"rgba(148,163,184,0.4)" }}>
                    Clear
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── ERROR STATE ── */}
          <AnimatePresence>
            {error && (
              <motion.div className="rounded-2xl px-6 py-4 mb-4 flex items-start gap-3"
                style={{ background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",backdropFilter:"blur(10px)" }}
                initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}>
                <WifiOff size={17} style={{ color:"#f87171",flexShrink:0,marginTop:1 }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color:"#fca5a5" }}>Could not load news</div>
                  <div className="text-xs mt-0.5" style={{ color:"rgba(252,165,165,0.6)" }}>{error}</div>
                  <a href="https://gnews.io" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold no-underline" style={{ color:"#818cf8" }}>
                    Get free GNews API key <ExternalLink size={11} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── NEWS GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-x-4">
            <div>
              {loading
                ? Array.from({ length:4 }).map((_,i) => <SkeletonCard key={i} />)
                : articles.slice(0, Math.ceil(articles.length/2)).map((a,i) => (
                    <NewsCard key={a.url+i} article={a} accent={accent} index={i} />
                  ))
              }
            </div>
            <div>
              {!loading && articles.slice(Math.ceil(articles.length/2)).map((a,i) => (
                <NewsCard key={a.url+i} article={a} accent={accent} index={i+Math.ceil(articles.length/2)} />
              ))}
              {loading && Array.from({ length:4 }).map((_,i) => <SkeletonCard key={"r"+i} />)}
            </div>
          </div>

          {/* Empty state */}
          {!loading && !error && articles.length===0 && (
            <motion.div className="text-center py-16" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <BookOpen size={32} style={{ color:"rgba(148,163,184,0.2)",margin:"0 auto 12px" }} />
              <p className="text-sm" style={{ color:"rgba(148,163,184,0.4)" }}>No articles found. Try a different topic.</p>
            </motion.div>
          )}

          {/* Load more */}
          {!loading && !error && articles.length>0 && hasMore && (
            <div className="flex justify-center mt-4 mb-8">
              <button onClick={handleLoadMore} disabled={loadingMore}
                className="load-more-btn flex items-center gap-2 px-8 py-3 rounded-xl border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200"
                style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 0 20px rgba(99,102,241,0.3)" }}>
                {loadingMore
                  ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Loading…</>
                  : <><TrendingUp size={14}/>Load More Articles</>}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default TechNews;