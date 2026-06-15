import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { addUser } from "../../utils/userSlice";
import { BASE_URL } from "../../utils/constants";
import { Camera, Save, X, Plus, Check, MapPin, Briefcase,Globe, Github, Linkedin, Twitter, Edit3, Code2,Layers, Cpu, Coffee, BookOpen, Award, FolderGit2,GraduationCap, Link2, FileText, ChevronRight,User, Share2, FlaskConical, Upload, Trash2,Phone, Mail, Calendar, Languages, DollarSign,Building2, Zap, Star, ExternalLink, Download,ChevronDown, Tag, Heart, Target, Clock,} from "lucide-react";
import { PLATFORMS } from "../../constants/platforms.jsx";
import {SKILL_SUGGESTIONS,SKILL_COLORS,} from "../../constants/skills";
import {EDIT_TABS,BLANK_EXP,} from "../../constants/tabs.jsx";
import { buildForm } from "../../utils/buildForm";
import StarCanvas from "./StarCanvas.jsx";
import FInput from "./FInput";
import StatPill from "./StatPill";
import ResumeUpload from "./ResumeUpload";
import SkillTag from "./SkillTag";
import SectionCard from "./SectionCard";
import SLabel from "./SLabel";
import SkillSuggestions from "./SkillSuggestions";
import ExperienceItem from "./ExperienceItem";
import "./profile.css";
import PostEdit from "./PostEdit.jsx";

const Profile = () => {
  const user     = useSelector(s => s.user);
  const dispatch = useDispatch();
  const fileInputRef  = useRef(null);
  const coverInputRef = useRef(null);
  const [form,         setForm]         = useState(() => buildForm(user));
  const [editing,      setEditing]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [error,        setError]        = useState("");
  const [newSkill,     setNewSkill]     = useState("");
  const [newProject,   setNewProject]   = useState({ name: "", url: "", description: "" });
  const [newCert,      setNewCert]      = useState({ name: "", issuer: "", year: "" });
  const [activeTab,    setActiveTab]    = useState("basic");
  const [connections,  setConnections]  = useState(0);
  const [newExp,       setNewExp]       = useState(BLANK_EXP);
  const [addingExp,    setAddingExp]    = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (!user) return;
    const checks = [
      !!user.firstName, !!user.lastName, !!user.about, !!user.headline,
      !!user.photoUrl, !!user.coverPhotoUrl, (user.skills?.length > 0),
      !!user.location, !!user.company, (user.experience?.length > 0),
      !!user.githubId || !!user.linkedIn, !!user.resumeUrl,
      (user.projects?.length > 0), (user.certifications?.length > 0),
      !!user.phone,
    ];
    setProfileCompletion(Math.round((checks.filter(Boolean).length / checks.length) * 100));
  }, [user]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/connections-count", { withCredentials: true });
        setConnections(res.data.count);
      } catch {}
    };
    fetchConnections();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
        dispatch(addUser(res.data));
      } catch {}
    };
    if (!user || !user.firstName) fetchUser();
  }, []);

  useEffect(() => { setForm(buildForm(user)); }, [user]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setBool = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const addSkillDirect = (skill) => {
    if (skill && !form.skills.includes(skill) && form.skills.length < 10)
      setForm(f => ({ ...f, skills: [...f.skills, skill] }));
  };

  const addSkill = () => { addSkillDirect(newSkill.trim()); setNewSkill(""); };

  const handleSave = async () => {
    try {
      setSaving(true); setError("");
      const payload = {
        firstName: form.firstName, lastName: form.lastName,
        about: form.about, headline: form.headline,
        phone: form.phone, skills: form.skills,
        company: form.company, location: form.location,
        openToWork: form.openToWork, jobType: form.jobType,
        expectedSalary: form.expectedSalary,
        preferredLanguages: form.preferredLanguages,
        portfolio: form.portfolio, githubId: form.githubId,
        linkedIn: form.linkedIn, twitterId: form.twitterId,
        leetcodeId: form.leetcodeId, codechefId: form.codechefId,
        codeforcesId: form.codeforcesId, hackerRankId: form.hackerRankId,
        kaggleId: form.kaggleId, mediumId: form.mediumId,
        devToId: form.devToId, npmId: form.npmId,
        projects: form.projects, certifications: form.certifications,
        experience: form.experience,
        academicQualifications: {
          tenth:   { school: form.tenth_school,   board: form.tenth_board,   percentage: Number(form.tenth_pct)   || undefined },
          twelfth: { school: form.twelfth_school, board: form.twelfth_board, percentage: Number(form.twelfth_pct) || undefined },
          ug:      { college: form.ug_college, degree: form.ug_degree, branch: form.ug_branch, sgpa: Number(form.ug_sgpa) || undefined },
          pg:      { college: form.pg_college, degree: form.pg_degree, branch: form.pg_branch, sgpa: Number(form.pg_sgpa) || undefined },
        },
      };
      if (form.age)    payload.age    = Number(form.age);
      if (form.gender) payload.gender = form.gender;

      await axios.patch(BASE_URL + "/profile/edit", payload, { withCredentials: true });
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      dispatch(addUser(res.data));
      setSaved(true); setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append("photo", file);
    try {
      const res = await axios.post(BASE_URL + "/profile/upload-photo", fd, { withCredentials: true });
      dispatch(addUser(res.data));
    } catch {}
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append("cover", file);
    try {
      await axios.post(BASE_URL + "/profile/upload-cover", fd, { withCredentials: true });
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      dispatch(addUser(res.data));
    } catch {}
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setResumeUploading(true);
    const fd = new FormData(); fd.append("resume", file);
    try {
      await axios.post(BASE_URL + "/profile/upload-resume", fd, { withCredentials: true });
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      dispatch(addUser(res.data));
    } catch {}
    finally { setResumeUploading(false); }
  };

  const handleAddExp = () => {
    if (!newExp.title || !newExp.company) return;
    setForm(f => ({ ...f, experience: [...f.experience, newExp] }));
    setNewExp(BLANK_EXP); setAddingExp(false);
  };

  const handleCancel = () => { setForm(buildForm(user)); setEditing(false); setError(""); };

  const displayName   = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Your Name";
  const displayAvatar = user?.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const aq = user?.academicQualifications;
  const activePlatforms = PLATFORMS.filter(p => form[p.key]);

  return (
    <>
      <div className="prof-root relative min-h-screen overflow-x-hidden pb-24" style={{ background: "#060614", fontFamily: "'DM Sans',sans-serif" }}>
        <StarCanvas />

        {/* BG orbs */}
        <div className="fixed rounded-full pointer-events-none z-0" style={{ width:500,height:500,background:"radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)",top:-100,right:-100,filter:"blur(80px)" }} />
        <div className="fixed rounded-full pointer-events-none z-0" style={{ width:400,height:400,background:"radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)",bottom:50,left:-100,filter:"blur(80px)" }} />

        {/* Toast */}
        <AnimatePresence>
          {saved && (
            <motion.div className="fixed bottom-7 right-7 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5"
              style={{ background:"rgba(8,8,28,0.95)",border:"1px solid rgba(52,211,153,0.3)",boxShadow:"0 0 32px rgba(52,211,153,0.2),0 16px 40px rgba(0,0,0,0.4)",fontSize:13.5,fontWeight:600,color:"#e2e8f0" }}
              initial={{ opacity:0,y:20,scale:0.95 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:20,scale:0.95 }}
              transition={{ type:"spring",stiffness:80 }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:"linear-gradient(135deg,#6366f1,#34d399)" }}>
                <Check size={14} color="#fff" />
              </div>
              Profile saved successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-7 pt-10">

          {/* ══ HERO CARD ══ */}
          <motion.div className="rounded-3xl overflow-hidden mb-5"
            style={{ border:"1px solid rgba(255,255,255,0.07)",background:"rgba(8,8,28,0.7)",backdropFilter:"blur(20px)",boxShadow:"0 0 0 1px rgba(99,102,241,0.08),0 24px 64px rgba(0,0,0,0.5)" }}
            initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ type:"spring",stiffness:60,damping:16 }}
          >
            {/* Cover */}
            <div className="cover-overlay cover-edit-hover relative h-48 overflow-hidden cursor-pointer"
              onClick={() => editing && coverInputRef.current.click()}
              style={{
                backgroundImage: user?.coverPhotoUrl ? `url(${user.coverPhotoUrl})` : "linear-gradient(135deg,rgba(99,102,241,0.35),rgba(139,92,246,0.25))",
                backgroundSize:"cover", backgroundPosition:"center",
              }}
            >
              <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"30px 30px" }} />
              {editing && (
                <div className="cover-hint absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-200 z-10" style={{ background:"rgba(0,0,0,0.5)" }}>
                  <Camera size={18} color="#fff" />
                  <span className="text-white font-semibold text-sm">Change Cover Photo</span>
                </div>
              )}
              {/* Open to work badge */}
              {user?.openToWork && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background:"rgba(52,211,153,0.9)",backdropFilter:"blur(10px)" }}>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                  <span className="text-xs font-bold text-white">Open to Work</span>
                </div>
              )}
            </div>

            {/* Avatar + profile body */}
            <div className="px-6 md:px-8 pb-7 relative">
              <div className="flex items-end gap-4 -mt-14 mb-4 flex-wrap">
                {/* Avatar */}
                <div className="avatar-edit-hover relative inline-block flex-shrink-0 cursor-pointer z-10"
                  onClick={() => editing && fileInputRef.current.click()}
                >
                  <img className="w-[104px] h-[104px] rounded-[24px] object-cover" style={{ border:"3px solid rgba(99,102,241,0.3)",boxShadow:"0 0 32px rgba(99,102,241,0.25)" }} src={displayAvatar} alt={displayName} />
                  {editing && (
                    <div className="avatar-hint absolute inset-0 rounded-[24px] flex flex-col items-center justify-center gap-1 opacity-0 transition-all duration-200" style={{ background:"rgba(0,0,0,0.6)" }}>
                      <Camera size={20} color="#fff" />
                      <span className="text-white text-[10px] font-bold">Change</span>
                    </div>
                  )}
                </div>

                {/* Profile completion bar — shown when not editing */}
                {!editing && (
                  <div className="flex-1 pt-16 min-w-[200px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase" style={{ color:"rgba(148,163,184,0.45)",letterSpacing:"0.1em" }}>Profile Completion</span>
                      <span className="text-xs font-bold" style={{ color: profileCompletion >= 80 ? "#34d399" : profileCompletion >= 50 ? "#fbbf24" : "#f472b6" }}>{profileCompletion}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full completion-bar" style={{
                        width:`${profileCompletion}%`,
                        background: profileCompletion >= 80
                          ? "linear-gradient(90deg,#34d399,#10b981)"
                          : profileCompletion >= 50
                          ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
                          : "linear-gradient(90deg,#f472b6,#ec4899)",
                      }}/>
                    </div>
                  </div>
                )}
              </div>

              <input type="file" ref={fileInputRef}  className="hidden" accept="image/*" onChange={handlePhotoChange} />
              <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />

              {/* Name + CTA */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-extrabold text-white leading-none tracking-tight" style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(22px,3vw,30px)",letterSpacing:"-1px" }}>
                    {displayName}
                  </h1>
                  {(user?.headline || form.company) && (
                    <p className="mt-1 text-sm font-semibold" style={{ color:"rgba(165,180,252,0.8)" }}>
                      {user?.headline || (form.company ? `@ ${form.company}` : "")}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-medium" style={{ color:"rgba(148,163,184,0.45)" }}>
                    {form.company && !user?.headline ? `@ ${form.company}` : form.company ? `@ ${form.company}` : "Connectra Member"}
                    {form.age ? ` · ${form.age} yrs` : ""}
                    {form.gender ? ` · ${form.gender}` : ""}
                  </p>
                  <p className="mt-1 text-xs" style={{ color:"rgba(148,163,184,0.3)" }}>{user?.emailId}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {user?.resumeUrl && !editing && (
                    <a href={user.resumeUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl no-underline text-sm font-semibold"
                      style={{ background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.25)",color:"#34d399" }}
                    ><Download size={14}/> Resume</a>
                  )}
                  {!editing && (
                    <button
                      className="edit-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200"
                      style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 0 20px rgba(99,102,241,0.3)" }}
                      onClick={() => setEditing(true)}
                    ><Edit3 size={14}/> Edit Profile</button>
                  )}
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 mt-4">
                {form.location && <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color:"rgba(148,163,184,0.55)" }}><MapPin size={13} style={{ color:"#818cf8" }}/>{form.location}</div>}
                {form.company  && <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color:"rgba(148,163,184,0.55)" }}><Briefcase size={13} style={{ color:"#818cf8" }}/>{form.company}</div>}
                {form.phone    && <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color:"rgba(148,163,184,0.55)" }}><Phone size={13} style={{ color:"#818cf8" }}/>{form.phone}</div>}
                {user?.openToWork && form.jobType && (
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color:"rgba(52,211,153,0.8)" }}><Heart size={13} style={{ color:"#34d399" }}/>{form.jobType}</div>
                )}
              </div>

              {/* About */}
              {form.about && <p className="mt-4 text-sm leading-relaxed max-w-[640px]" style={{ color:"rgba(199,210,254,0.65)" }}>{form.about}</p>}

              {/* Skills cloud */}
              {!editing && form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {form.skills.map((s, i) => <SkillTag key={s} skill={s} accent={SKILL_COLORS[i % SKILL_COLORS.length]} />)}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-3 mt-5 flex-wrap">
                <StatPill value={form.skills.length}         label="Skills"       color="#818cf8" />
                <StatPill value={connections}                label="Connections"  color="#34d399" />
                <StatPill value={form.projects.length}       label="Projects"     color="#60a5fa" />
                <StatPill value={form.certifications.length} label="Certs"        color="#f472b6" />
                <StatPill value={form.experience.length}     label="Experience"   color="#fbbf24" />
              </div>

              {/* Social links display */}
              {!editing && activePlatforms.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-4">
                  {activePlatforms.map(p => (
                    <a key={p.key} href={p.url(form[p.key])} target="_blank" rel="noreferrer"
                      className="social-link flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] no-underline text-xs font-medium transition-all duration-200"
                      style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(148,163,184,0.65)" }}
                    >{p.icon}{p.label}</a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ══ DISPLAY SECTIONS (not editing) ══ */}
          {!editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Experience */}
              {user?.experience?.length > 0 && (
                <SectionCard title="Work Experience" icon={<Briefcase size={16}/>}>
                  <div className="flex flex-col">
                    {user.experience.map((exp, i) => (
                      <ExperienceItem key={i} exp={exp} index={i} />
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Academic */}
              {aq && (aq.tenth?.school || aq.twelfth?.school || aq.ug?.college || aq.pg?.college) && (
                <SectionCard title="Academic Qualifications" icon={<GraduationCap size={16}/>}>
                  <div className="flex flex-col gap-3">
                    {aq.tenth?.school && (
                      <div className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-[10px] font-bold uppercase mb-1" style={{ color:"#60a5fa",letterSpacing:"0.1em" }}>10th</div>
                        <div className="text-sm font-semibold text-slate-200">{aq.tenth.school}</div>
                        <div className="text-xs mt-0.5" style={{ color:"rgba(148,163,184,0.5)" }}>{aq.tenth.board}{aq.tenth.percentage ? ` · ${aq.tenth.percentage}%` : ""}</div>
                      </div>
                    )}
                    {aq.twelfth?.school && (
                      <div className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-[10px] font-bold uppercase mb-1" style={{ color:"#a78bfa",letterSpacing:"0.1em" }}>12th</div>
                        <div className="text-sm font-semibold text-slate-200">{aq.twelfth.school}</div>
                        <div className="text-xs mt-0.5" style={{ color:"rgba(148,163,184,0.5)" }}>{aq.twelfth.board}{aq.twelfth.percentage ? ` · ${aq.twelfth.percentage}%` : ""}</div>
                      </div>
                    )}
                    {aq.ug?.college && (
                      <div className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-[10px] font-bold uppercase mb-1" style={{ color:"#34d399",letterSpacing:"0.1em" }}>Graduation (UG)</div>
                        <div className="text-sm font-semibold text-slate-200">{aq.ug.college}</div>
                        <div className="text-xs mt-0.5" style={{ color:"rgba(148,163,184,0.5)" }}>{aq.ug.degree}{aq.ug.branch ? ` · ${aq.ug.branch}` : ""}{aq.ug.sgpa ? ` · SGPA ${aq.ug.sgpa}` : ""}</div>
                      </div>
                    )}
                    {aq.pg?.college && (
                      <div className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-[10px] font-bold uppercase mb-1" style={{ color:"#fbbf24",letterSpacing:"0.1em" }}>Post Graduation (PG)</div>
                        <div className="text-sm font-semibold text-slate-200">{aq.pg.college}</div>
                        <div className="text-xs mt-0.5" style={{ color:"rgba(148,163,184,0.5)" }}>{aq.pg.degree}{aq.pg.branch ? ` · ${aq.pg.branch}` : ""}{aq.pg.sgpa ? ` · SGPA ${aq.pg.sgpa}` : ""}</div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* Projects */}
              {user?.projects?.length > 0 && (
                <SectionCard title="Projects" icon={<FolderGit2 size={16}/>}>
                  <div className="flex flex-col gap-2">
                    {user.projects.map((p, i) => {
                      const proj = typeof p === "object" ? p : { name: p };
                      return (
                        <div key={i} className="rounded-xl px-4 py-3" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)" }}>
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <ChevronRight size={13} style={{ color:"#818cf8",flexShrink:0 }} />
                              <span className="text-sm font-semibold text-slate-300">{proj.name}</span>
                            </div>
                            {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" style={{ color:"#818cf8" }}><ExternalLink size={12}/></a>}
                          </div>
                          {proj.description && <p className="text-xs mt-1 pl-5" style={{ color:"rgba(148,163,184,0.5)" }}>{proj.description}</p>}
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              )}

              {/* Certifications */}
              {user?.certifications?.length > 0 && (
                <SectionCard title="Certifications" icon={<Award size={16}/>}>
                  <div className="flex flex-col gap-2">
                    {user.certifications.map((c, i) => {
                      const cert = typeof c === "object" ? c : { name: c };
                      return (
                        <div key={i} className="rounded-xl px-4 py-3" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)" }}>
                          <div className="flex items-center gap-2">
                            <Award size={13} style={{ color:"#f472b6",flexShrink:0 }} />
                            <span className="text-sm font-semibold text-slate-300">{cert.name}</span>
                          </div>
                          {(cert.issuer || cert.year) && <p className="text-xs mt-0.5 pl-5" style={{ color:"rgba(148,163,184,0.5)" }}>{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>}
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              )}

              {/* GitHub */}
              {form.githubId && (
                <SectionCard title="GitHub" icon={<Github size={16}/>}>
                  <a href={`https://github.com/${form.githubId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 no-underline text-sm font-medium mb-3" style={{ color:"#a5b4fc" }}>
                    <Github size={15}/> github.com/{form.githubId}
                  </a>
                  <img
                    src={`https://github-readme-stats.vercel.app/api?username=${form.githubId}&show_icons=true&theme=tokyonight&bg_color=00000000&title_color=818cf8&text_color=94a3b8&icon_color=818cf8&border_color=ffffff18&hide_border=false`}
                    alt="GitHub Stats" className="w-full rounded-xl"
                    onError={e => { e.currentTarget.style.display="none"; }}
                  />
                  <img
                    src={`https://github-readme-streak-stats.herokuapp.com?user=${form.githubId}&theme=tokyonight&background=00000000&border=ffffff18&ring=818cf8&fire=f472b6&currStreakLabel=a5b4fc`}
                    alt="Streak" className="w-full rounded-xl mt-2"
                    onError={e => { e.currentTarget.style.display="none"; }}
                  />
                </SectionCard>
              )}

              {/* LeetCode */}
              {form.leetcodeId && (
                <SectionCard title="LeetCode" icon={<FlaskConical size={16}/>}>
                  <a href={`https://leetcode.com/${form.leetcodeId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 no-underline text-sm font-medium" style={{ color:"#fbbf24" }}>
                    <Code2 size={15}/> leetcode.com/{form.leetcodeId}
                  </a>
                  <img
                    src={`https://leetcard.jacoblin.cool/${form.leetcodeId}?theme=dark&font=Baloo_2&ext=heatmap&border=0&radius=12`}
                    alt="LeetCode Stats" className="w-full rounded-xl mt-3"
                    onError={e => { e.currentTarget.style.display="none"; }}
                  />
                </SectionCard>
              )}

              {/* CodeChef */}
              {form.codechefId && (
                <SectionCard title="CodeChef" icon={<FlaskConical size={16}/>}>
                  <a href={`https://codechef.com/users/${form.codechefId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 no-underline text-sm font-medium" style={{ color:"#fbbf24" }}>
                    <Code2 size={15}/> codechef.com/users/{form.codechefId}
                  </a>
                </SectionCard>
              )}
            </div>
          )}

          {/* ══ EDIT PANEL ══ */}
          <AnimatePresence>
            {editing && (
              <motion.div className="rounded-3xl overflow-hidden mb-5"
                style={{ border:"1px solid rgba(99,102,241,0.2)",background:"rgba(8,8,28,0.85)",backdropFilter:"blur(20px)",boxShadow:"0 0 0 1px rgba(99,102,241,0.1),0 24px 64px rgba(0,0,0,0.5)" }}
                initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }}
                transition={{ type:"spring",stiffness:60,damping:16 }}
              >
                {/* Edit header */}
                <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(99,102,241,0.05)" }}>
                  <div className="flex items-center gap-2.5 font-extrabold text-slate-200 tracking-tight" style={{ fontFamily:"'Syne',sans-serif",fontSize:16,letterSpacing:"-0.4px" }}>
                    <Edit3 size={16} style={{ color:"#818cf8" }} />
                    Edit Profile
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md" style={{ background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.3)",color:"#a5b4fc",letterSpacing:"0.1em" }}>Editing</span>
                  </div>
                  <button className="cancel-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200"
                    style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.65)",fontFamily:"'DM Sans',sans-serif" }}
                    onClick={handleCancel}
                  ><X size={13}/> Discard</button>
                </div>

                {/* Tabs */}
                <div className="px-7 pt-6">
                  <div className="flex flex-wrap gap-1 rounded-xl p-1 w-fit mb-6" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)" }}>
                    {EDIT_TABS.map(tab => (
                      <button key={tab.id}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] text-[12px] font-semibold cursor-pointer border-none capitalize tracking-wide transition-all duration-200 ${activeTab === tab.id ? "tab-active" : "tab-inactive"}`}
                        style={{ fontFamily:"'DM Sans',sans-serif",color: activeTab===tab.id?"#fff":"rgba(148,163,184,0.55)",background: activeTab===tab.id ? undefined : "transparent" }}
                        onClick={() => setActiveTab(tab.id)}
                      >{tab.icon}{tab.label}</button>
                    ))}
                  </div>
                </div>

                <div className="px-7 pb-2">
                  <AnimatePresence mode="wait">

                    {/* ── BASIC TAB ── */}
                    {activeTab === "basic" && (
                      <motion.div key="basic" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Personal Info</SLabel>
                        <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                          <FInput label="First Name" value={form.firstName} onChange={set("firstName")} icon={<User size={15}/>} />
                          <FInput label="Last Name"  value={form.lastName}  onChange={set("lastName")}  icon={<User size={15}/>} />
                          <FInput label="Age" value={form.age} onChange={set("age")} type="number" icon={<Coffee size={15}/>} />
                          <div className="relative mb-4">
                            <div className="absolute -inset-px rounded-[13px] z-0 opacity-50" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))" }}/>
                            <div className="relative z-10 rounded-xl backdrop-blur-xl" style={{ background:"rgba(8,8,28,0.85)" }}>
                              <div className="px-3.5 pt-2 pb-1 text-[9.5px] font-bold uppercase" style={{ color:"rgba(148,163,184,0.4)",letterSpacing:"0.09em" }}>Gender</div>
                              <select value={form.gender} onChange={set("gender")} className="w-full bg-transparent border-none outline-none text-sm cursor-pointer pb-3 px-3.5" style={{ color: form.gender?"#e2e8f0":"rgba(148,163,184,0.4)",fontFamily:"'DM Sans',sans-serif" }}>
                                <option value="" style={{ background:"#0a0a1e" }}>Select gender</option>
                                <option value="male"   style={{ background:"#0a0a1e" }}>Male</option>
                                <option value="female" style={{ background:"#0a0a1e" }}>Female</option>
                                <option value="other"  style={{ background:"#0a0a1e" }}>Other</option>
                              </select>
                            </div>
                          </div>
                          <FInput label="Phone / WhatsApp" value={form.phone} onChange={set("phone")} icon={<Phone size={15}/>} placeholder="+91 98765 43210" />
                        </div>
                        <SLabel>Professional Headline</SLabel>
                        <FInput label="e.g. Full-Stack Developer @ Google · Open Source Enthusiast" value={form.headline} onChange={set("headline")} icon={<Zap size={15}/>} />
                        <SLabel>About</SLabel>
                        <FInput label="Tell the community about yourself" value={form.about} onChange={set("about")} multiline placeholder="I'm a full-stack developer who loves open source..." icon={<Layers size={15}/>} />
                      </motion.div>
                    )}

                    {/* ── WORK TAB ── */}
                    {activeTab === "work" && (
                      <motion.div key="work" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Current Position</SLabel>
                        <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                          <FInput label="Company / Role"    value={form.company}  onChange={set("company")}  icon={<Briefcase size={15}/>} />
                          <FInput label="Location"          value={form.location} onChange={set("location")} icon={<MapPin size={15}/>} />
                        </div>

                        <SLabel>Job Preferences</SLabel>
                        <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-4 cursor-pointer"
                          style={{ background:"rgba(255,255,255,0.03)",border:`1px solid ${form.openToWork?"rgba(52,211,153,0.3)":"rgba(255,255,255,0.07)"}` }}
                          onClick={() => setBool("openToWork")(!form.openToWork)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${form.openToWork?"":"opacity-30"}`}
                              style={{ background: form.openToWork?"rgba(52,211,153,0.9)":"rgba(255,255,255,0.1)", border:"2px solid transparent" }}
                            >{form.openToWork && <Check size={11} color="#fff"/>}</div>
                            <div>
                              <div className="text-sm font-semibold" style={{ color: form.openToWork?"#34d399":"#e2e8f0" }}>Open to Work</div>
                              <div className="text-[11px]" style={{ color:"rgba(148,163,184,0.45)" }}>Signal to recruiters you're available</div>
                            </div>
                          </div>
                          <div className={`w-10 h-5 rounded-full transition-all duration-300 relative`} style={{ background: form.openToWork?"#34d399":"rgba(255,255,255,0.1)" }}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300`} style={{ left: form.openToWork?"calc(100% - 18px)":"2px" }}/>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                          <div className="relative mb-4">
                            <div className="absolute -inset-px rounded-[13px] z-0 opacity-50" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))" }}/>
                            <div className="relative z-10 rounded-xl backdrop-blur-xl" style={{ background:"rgba(8,8,28,0.85)" }}>
                              <div className="px-3.5 pt-2 pb-1 text-[9.5px] font-bold uppercase" style={{ color:"rgba(148,163,184,0.4)",letterSpacing:"0.09em" }}>Job Type</div>
                              <select value={form.jobType} onChange={set("jobType")} className="w-full bg-transparent border-none outline-none text-sm cursor-pointer pb-3 px-3.5" style={{ color: form.jobType?"#e2e8f0":"rgba(148,163,184,0.4)",fontFamily:"'DM Sans',sans-serif" }}>
                                <option value="" style={{ background:"#0a0a1e" }}>Select type</option>
                                {["Full-time","Part-time","Contract","Freelance","Internship","Remote"].map(t => (
                                  <option key={t} value={t} style={{ background:"#0a0a1e" }}>{t}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <FInput label="Expected CTC (LPA)" value={form.expectedSalary} onChange={set("expectedSalary")} icon={<DollarSign size={15}/>} placeholder="e.g. 12 LPA" />
                        </div>
                      </motion.div>
                    )}

                    {/* ── PLATFORMS TAB ── */}
                    {activeTab === "platforms" && (
                      <motion.div key="platforms" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Coding & Social Platforms</SLabel>
                        <div className="grid grid-cols-1 gap-2 mb-4">
                          {PLATFORMS.map(p => (
                            <div key={p.key} className="platform-card rounded-xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)" }}>
                              <FInput label={p.label} value={form[p.key]} onChange={set(p.key)} icon={p.icon} placeholder={p.placeholder} />
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 p-4 rounded-xl mb-4" style={{ background:"rgba(52,211,153,0.05)",border:"1px solid rgba(52,211,153,0.12)" }}>
                          <div className="text-xs font-semibold mb-1" style={{ color:"#34d399" }}>🔗 Usernames only (except Portfolio)</div>
                          <div className="text-[12.5px] leading-relaxed" style={{ color:"rgba(148,163,184,0.55)" }}>Enter your username for all platforms. For Portfolio, enter the full URL.</div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── SKILLS TAB ── */}
                    {activeTab === "skills" && (
                      <motion.div key="skills" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Your Skills (max 10)</SLabel>
                        <div className="flex gap-2 mb-3.5">
                          <div className="flex-1">
                            <FInput label="Add a skill (e.g. React, Python…)" value={newSkill}
                              onChange={e => setNewSkill(e.target.value)}
                              icon={<Cpu size={15}/>}
                            />
                          </div>
                          <button className="add-btn flex items-center gap-1.5 px-4 rounded-xl border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap mb-4 h-[50px]"
                            style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 0 16px rgba(99,102,241,0.3)" }}
                            onClick={addSkill}
                          ><Plus size={14}/> Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                          <AnimatePresence>
                            {form.skills.length === 0
                              ? <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm py-2.5" style={{ color:"rgba(148,163,184,0.35)" }}>No skills yet. Use suggestions below!</motion.div>
                              : form.skills.map((s, i) => <SkillTag key={s} skill={s} accent={SKILL_COLORS[i%SKILL_COLORS.length]} onRemove={() => setForm(f=>({...f,skills:f.skills.filter(x=>x!==s)}))} />)
                            }
                          </AnimatePresence>
                        </div>
                        <SkillSuggestions currentSkills={form.skills} onAdd={addSkillDirect} />
                      </motion.div>
                    )}

                    {/* ── EXPERIENCE TAB ── */}
                    {activeTab === "experience" && (
                      <motion.div key="exp" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Work Experience</SLabel>
                        <div className="flex flex-col gap-1 mb-4">
                          <AnimatePresence>
                            {form.experience.length === 0 && !addingExp && (
                              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm py-2" style={{ color:"rgba(148,163,184,0.35)" }}>No experience added yet.</motion.div>
                            )}
                            {form.experience.map((exp, i) => (
                              <ExperienceItem key={i} exp={exp} index={i} onRemove={() => setForm(f => ({ ...f, experience: f.experience.filter((_,j)=>j!==i) }))} />
                            ))}
                          </AnimatePresence>
                        </div>

                        {addingExp ? (
                          <motion.div className="rounded-xl p-5 mb-4" style={{ background:"rgba(99,102,241,0.05)",border:"1px solid rgba(99,102,241,0.2)" }}
                            initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }}
                          >
                            <div className="text-xs font-bold uppercase mb-4" style={{ color:"#818cf8",letterSpacing:"0.1em" }}>New Experience</div>
                            <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                              <FInput label="Job Title"   value={newExp.title}      onChange={e=>setNewExp(x=>({...x,title:e.target.value}))}      icon={<Briefcase size={15}/>} />
                              <FInput label="Company"     value={newExp.company}    onChange={e=>setNewExp(x=>({...x,company:e.target.value}))}    icon={<Building2 size={15}/>} />
                              <FInput label="Location"    value={newExp.location}   onChange={e=>setNewExp(x=>({...x,location:e.target.value}))}   icon={<MapPin size={15}/>} />
                              <div className="relative mb-4">
                                <div className="absolute -inset-px rounded-[13px] z-0 opacity-50" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))" }}/>
                                <div className="relative z-10 rounded-xl backdrop-blur-xl" style={{ background:"rgba(8,8,28,0.85)" }}>
                                  <div className="px-3.5 pt-2 pb-1 text-[9.5px] font-bold uppercase" style={{ color:"rgba(148,163,184,0.4)",letterSpacing:"0.09em" }}>Employment Type</div>
                                  <select value={newExp.employmentType} onChange={e=>setNewExp(x=>({...x,employmentType:e.target.value}))} className="w-full bg-transparent border-none outline-none text-sm cursor-pointer pb-3 px-3.5" style={{ color: newExp.employmentType?"#e2e8f0":"rgba(148,163,184,0.4)",fontFamily:"'DM Sans',sans-serif" }}>
                                    <option value="" style={{ background:"#0a0a1e" }}>Type</option>
                                    {["Full-time","Part-time","Contract","Internship","Freelance"].map(t => <option key={t} value={t} style={{ background:"#0a0a1e" }}>{t}</option>)}
                                  </select>
                                </div>
                              </div>
                              <FInput label="Start (e.g. Jun 2022)" value={newExp.startDate} onChange={e=>setNewExp(x=>({...x,startDate:e.target.value}))} icon={<Calendar size={15}/>} />
                              {!newExp.current && <FInput label="End (e.g. Dec 2023)" value={newExp.endDate} onChange={e=>setNewExp(x=>({...x,endDate:e.target.value}))} icon={<Calendar size={15}/>} />}
                            </div>
                            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setNewExp(x=>({...x,current:!x.current,endDate:""}))}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center ${newExp.current?"":"opacity-40"}`} style={{ background:newExp.current?"rgba(52,211,153,0.9)":"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)" }}>
                                {newExp.current && <Check size={10} color="#fff"/>}
                              </div>
                              <span className="text-xs font-medium" style={{ color:"rgba(148,163,184,0.65)" }}>Currently working here</span>
                            </div>
                            <FInput label="Description (optional)" value={newExp.description} onChange={e=>setNewExp(x=>({...x,description:e.target.value}))} multiline placeholder="What did you work on?" icon={<FileText size={15}/>} />
                            <div className="flex gap-2 mt-2">
                              <button onClick={handleAddExp} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-none text-white text-xs font-semibold cursor-pointer" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                                <Plus size={13}/> Add Experience
                              </button>
                              <button onClick={() => setAddingExp(false)} className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer border-none" style={{ background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.55)" }}>
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <button onClick={() => setAddingExp(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-none text-sm font-semibold cursor-pointer mb-4" style={{ background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",color:"#a5b4fc" }}>
                            <Plus size={14}/> Add Experience
                          </button>
                        )}
                      </motion.div>
                    )}

                    {/* ── ACADEMICS TAB ── */}
                    {activeTab === "academics" && (
                      <motion.div key="academics" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>10th Standard</SLabel>
                        <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">
                          <FInput label="School Name"  value={form.tenth_school} onChange={set("tenth_school")} icon={<BookOpen size={15}/>} />
                          <FInput label="Board"        value={form.tenth_board}  onChange={set("tenth_board")}  icon={<BookOpen size={15}/>} />
                          <FInput label="Percentage %" value={form.tenth_pct}    onChange={set("tenth_pct")}    type="number" icon={<Coffee size={15}/>} />
                        </div>
                        <SLabel>12th Standard</SLabel>
                        <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">
                          <FInput label="School Name"  value={form.twelfth_school} onChange={set("twelfth_school")} icon={<BookOpen size={15}/>} />
                          <FInput label="Board"        value={form.twelfth_board}  onChange={set("twelfth_board")}  icon={<BookOpen size={15}/>} />
                          <FInput label="Percentage %" value={form.twelfth_pct}    onChange={set("twelfth_pct")}    type="number" icon={<Coffee size={15}/>} />
                        </div>
                        <SLabel>Graduation (UG)</SLabel>
                        <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                          <FInput label="College Name" value={form.ug_college} onChange={set("ug_college")} icon={<GraduationCap size={15}/>} />
                          <FInput label="Degree"       value={form.ug_degree}  onChange={set("ug_degree")}  icon={<BookOpen size={15}/>} />
                          <FInput label="Branch"       value={form.ug_branch}  onChange={set("ug_branch")}  icon={<Layers size={15}/>} />
                          <FInput label="SGPA"         value={form.ug_sgpa}    onChange={set("ug_sgpa")}    type="number" icon={<Coffee size={15}/>} />
                        </div>
                        <SLabel>Post Graduation (PG)</SLabel>
                        <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                          <FInput label="College Name" value={form.pg_college} onChange={set("pg_college")} icon={<GraduationCap size={15}/>} />
                          <FInput label="Degree"       value={form.pg_degree}  onChange={set("pg_degree")}  icon={<BookOpen size={15}/>} />
                          <FInput label="Branch"       value={form.pg_branch}  onChange={set("pg_branch")}  icon={<Layers size={15}/>} />
                          <FInput label="SGPA"         value={form.pg_sgpa}    onChange={set("pg_sgpa")}    type="number" icon={<Coffee size={15}/>} />
                        </div>
                      </motion.div>
                    )}

                    {/* ── PROJECTS & CERTS TAB ── */}
                    {activeTab === "projects" && (
                      <motion.div key="projects" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Projects (max 10)</SLabel>
                        <div className="rounded-xl p-4 mb-3" style={{ background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.15)" }}>
                          <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1 mb-0">
                            <FInput label="Project Name" value={newProject.name} onChange={e=>setNewProject(x=>({...x,name:e.target.value}))} icon={<FolderGit2 size={15}/>} />
                            <FInput label="GitHub / Live URL (optional)" value={newProject.url} onChange={e=>setNewProject(x=>({...x,url:e.target.value}))} icon={<Link2 size={15}/>} />
                          </div>
                          <FInput label="Short description (optional)" value={newProject.description} onChange={e=>setNewProject(x=>({...x,description:e.target.value}))} icon={<FileText size={15}/>} />
                          <button className="add-btn flex items-center gap-1.5 px-4 py-2 rounded-xl border-none text-white text-xs font-semibold cursor-pointer"
                            style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                            onClick={() => {
                              if (!newProject.name.trim() || form.projects.length >= 10) return;
                              setForm(f => ({ ...f, projects: [...f.projects, { ...newProject }] }));
                              setNewProject({ name:"",url:"",description:"" });
                            }}
                          ><Plus size={14}/> Add Project</button>
                        </div>
                        <div className="flex flex-col gap-2 mb-6">
                          <AnimatePresence>
                            {form.projects.length === 0
                              ? <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm py-2" style={{ color:"rgba(148,163,184,0.35)" }}>No projects added yet.</motion.div>
                              : form.projects.map((p, i) => {
                                  const proj = typeof p === "object" ? p : { name: p };
                                  return (
                                    <motion.div key={proj.name+i} initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                                      className="group flex items-start justify-between gap-2 rounded-xl px-4 py-3"
                                      style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)" }}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <ChevronRight size={13} style={{ color:"#818cf8" }}/>
                                          <span className="text-sm font-semibold text-slate-300">{proj.name}</span>
                                          {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" style={{ color:"#818cf8" }}><ExternalLink size={11}/></a>}
                                        </div>
                                        {proj.description && <p className="text-xs mt-0.5 pl-5" style={{ color:"rgba(148,163,184,0.5)" }}>{proj.description}</p>}
                                      </div>
                                      <button onClick={() => setForm(f=>({...f,projects:f.projects.filter((_,j)=>j!==i)}))}
                                        className="remove-x bg-transparent border-none cursor-pointer opacity-0 transition-opacity duration-200 flex-shrink-0" style={{ color:"rgba(252,165,165,0.7)" }}
                                      ><X size={13}/></button>
                                    </motion.div>
                                  );
                                })
                            }
                          </AnimatePresence>
                        </div>

                        <SLabel>Certifications (max 10)</SLabel>
                        <div className="rounded-xl p-4 mb-3" style={{ background:"rgba(244,114,182,0.04)",border:"1px solid rgba(244,114,182,0.15)" }}>
                          <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                            <FInput label="Certification Name" value={newCert.name}   onChange={e=>setNewCert(x=>({...x,name:e.target.value}))}   icon={<Award size={15}/>} />
                            <FInput label="Issuer (e.g. Coursera)" value={newCert.issuer} onChange={e=>setNewCert(x=>({...x,issuer:e.target.value}))} icon={<Building2 size={15}/>} />
                          </div>
                          <FInput label="Year (e.g. 2024)" value={newCert.year} onChange={e=>setNewCert(x=>({...x,year:e.target.value}))} icon={<Calendar size={15}/>} />
                          <button className="add-btn flex items-center gap-1.5 px-4 py-2 rounded-xl border-none text-white text-xs font-semibold cursor-pointer"
                            style={{ background:"linear-gradient(135deg,#f472b6,#8b5cf6)" }}
                            onClick={() => {
                              if (!newCert.name.trim() || form.certifications.length >= 10) return;
                              setForm(f => ({ ...f, certifications: [...f.certifications, { ...newCert }] }));
                              setNewCert({ name:"",issuer:"",year:"" });
                            }}
                          ><Plus size={14}/> Add Certification</button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <AnimatePresence>
                            {form.certifications.length === 0
                              ? <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm py-2" style={{ color:"rgba(148,163,184,0.35)" }}>No certifications added yet.</motion.div>
                              : form.certifications.map((c, i) => {
                                  const cert = typeof c === "object" ? c : { name: c };
                                  return (
                                    <motion.div key={cert.name+i} initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                                      className="group flex items-start justify-between gap-2 rounded-xl px-4 py-3"
                                      style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)" }}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Award size={13} style={{ color:"#f472b6" }}/>
                                          <span className="text-sm font-semibold text-slate-300">{cert.name}</span>
                                        </div>
                                        {(cert.issuer||cert.year) && <p className="text-xs mt-0.5 pl-5" style={{ color:"rgba(148,163,184,0.5)" }}>{cert.issuer}{cert.year?` · ${cert.year}`:""}</p>}
                                      </div>
                                      <button onClick={() => setForm(f=>({...f,certifications:f.certifications.filter((_,j)=>j!==i)}))}
                                        className="remove-x bg-transparent border-none cursor-pointer opacity-0 transition-opacity duration-200 flex-shrink-0" style={{ color:"rgba(252,165,165,0.7)" }}
                                      ><X size={13}/></button>
                                    </motion.div>
                                  );
                                })
                            }
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}

                    {/* ── RESUME TAB ── */}
                    {activeTab === "resume" && (
                      <motion.div key="resume" initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-12 }} transition={{ duration:0.2 }}>
                        <SLabel>Resume / CV</SLabel>
                        <ResumeUpload resumeUrl={user?.resumeUrl} onUpload={handleResumeUpload} uploading={resumeUploading} />
                        <div className="mt-4 p-4 rounded-xl" style={{ background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.15)" }}>
                          <div className="text-xs font-semibold mb-1" style={{ color:"#a5b4fc" }}>📄 Tips</div>
                          <div className="text-[12.5px] leading-relaxed" style={{ color:"rgba(148,163,184,0.55)" }}>
                            Keep your resume up to date. PDF format is recommended. Other members and recruiters can view and download it from your profile.
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                {/* Save bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap px-7 py-4 mt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(99,102,241,0.04)" }}>
                  <div>
                    {error && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm" style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#fca5a5" }}>
                        <X size={13} className="flex-shrink-0"/> {error}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2.5">
                    <button className="cancel-btn px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
                      style={{ border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.6)",fontFamily:"'DM Sans',sans-serif" }}
                      onClick={handleCancel}
                    >Cancel</button>
                    <button className="save-btn flex items-center gap-2 px-7 py-2.5 rounded-xl border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200"
                      style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 0 24px rgba(99,102,241,0.4)" }}
                      onClick={handleSave} disabled={saving}
                    >
                      {saving ? <><span className="prof-spinner"/> Saving…</> : <><Save size={14}/> Save Changes</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <PostEdit />
    </>
  );
};

export default Profile;

