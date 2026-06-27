import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FileText, Download, Loader2, Github, Linkedin, Code2, Sparkles } from "lucide-react";
import { Document, PDFDownloadLink, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { BASE_URL } from "../utils/constants";
import "../../src/index.css";

const AIResumeBuilder = () => {
  const user = useSelector((store) => store.user);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Guard: user not loaded yet (e.g. fresh page refresh) ──
  if (!user) {
    return (
      <div className="feed-root">
        <div className="feed-body" style={{ maxWidth: 720 }}>
          <div className="flex items-center justify-center" style={{ minHeight: 300 }}>
            <div
              className="w-7 h-7 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(124,58,237,0.2)", borderTopColor: "#818cf8" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Normalize academicQualifications to a single shape (array of objects) ──
  const educationList = Array.isArray(user.academicQualifications)
    ? user.academicQualifications
    : user.academicQualifications
    ? Object.values(user.academicQualifications)
    : [];

  // ── Projects/certifications can be plain strings OR objects ({name, url, description, _id} etc.) ──
  // Normalize both shapes into a single display string so nothing gets rendered as a raw object.
  const toDisplayText = (item) => {
    if (typeof item === "string") return item;
    if (!item || typeof item !== "object") return "";
    const main = item.name || item.title || "";
    const extra = item.description || item.issuer || "";
    const url = item.url || item.link || "";
    return [main, extra].filter(Boolean).join(" — ") + (url ? ` (${url})` : "");
  };

  const projectsList = (Array.isArray(user.projects) ? user.projects : []).map(toDisplayText).filter(Boolean);
  const certificationsList = (Array.isArray(user.certifications) ? user.certifications : []).map(toDisplayText).filter(Boolean);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/generate-resume`, {
        name: `${(user.firstName || "")} ${(user.lastName || "")}`.trim(),
        about: user.about || "",
        skills: Array.isArray(user.skills) && user.skills.length > 0 ? user.skills : ["JavaScript", "React"],
        projects: projectsList,
        education: educationList,
        certifications: certificationsList,
        experience: [],
      });
      setResume(res.data);
    } catch (err) {
      console.error(err);
      setError("Couldn't generate resume right now. Try again in a bit.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- PDF Styles (brand-matched indigo accent) ----------
  const styles = StyleSheet.create({
    page: { padding: 35, fontFamily: "Helvetica", fontSize: 11, color: "#1e1b2e", lineHeight: 1.5 },
    headerName: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#111", marginBottom: 4 },
    headerContacts: { flexDirection: "row", justifyContent: "center", fontSize: 10, color: "#6d28d9", marginBottom: 20 },
    contactLink: { marginHorizontal: 6, textDecoration: "none", color: "#6d28d9" },
    section: { marginBottom: 14 },
    sectionHeader: { fontSize: 13, fontWeight: "bold", color: "#6d28d9", borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 6 },
    bulletLine: { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
    bullet: { width: 10, fontSize: 12, color: "#6d28d9" },
    bulletText: { flex: 1 },
    skillWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    skillItem: { width: "33%", marginBottom: 4 },
  });

  // ---------- PDF Template ----------
  const MyResumePDF = ({ user, resume }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerName}>{user.firstName} {user.lastName}</Text>
        <View style={styles.headerContacts}>
          <Text>{user.emailId}</Text>
          {user.githubProfileUrl && <Link src={user.githubProfileUrl} style={styles.contactLink}>GitHub</Link>}
          {user.linkedIn && <Link src={user.linkedIn} style={styles.contactLink}>LinkedIn</Link>}
          {user.leetcodeId && <Link src={user.leetcodeId} style={styles.contactLink}>LeetCode</Link>}
        </View>

        {resume?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Objective</Text>
            <Text>{resume.summary}</Text>
          </View>
        )}

        {educationList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Education</Text>
            {educationList
              .filter((ed) => ed && (ed.degree || ed.school))
              .map((ed, i) => (
                <View key={i} style={styles.bulletLine}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={{ fontWeight: "bold" }}>{ed.degree || ed.school}</Text>
                    {ed.institution ? ` ${ed.institution}` : ""}
                    {ed.percentage ? ` (${ed.percentage}%)` : ed.sgpa ? ` (${ed.sgpa} SGPA)` : ""}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {resume?.skillsBullets?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Skills</Text>
            <View style={styles.skillWrap}>
              {resume.skillsBullets.map((s, i) => (
                <Text key={i} style={styles.skillItem}>• {s}</Text>
              ))}
            </View>
          </View>
        )}

        {resume?.experienceBullets?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Experience</Text>
            {resume.experienceBullets.map((e, i) => (
              <View key={i} style={styles.bulletLine}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{e}</Text>
              </View>
            ))}
          </View>
        )}

        {projectsList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Projects</Text>
            {projectsList.map((p, i) => (
              <View key={i} style={styles.bulletLine}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </View>
        )}

        {certificationsList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Certifications</Text>
            {certificationsList.map((c, i) => (
              <View key={i} style={styles.bulletLine}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );

  /* ── Small reusable dark glass section block ── */
  const Section = ({ title, children }) => (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: "20px 22px",
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#a5b4fc",
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );

  const BulletList = ({ items }) => (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 13.5,
            color: "rgba(226,232,240,0.85)",
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#818cf8", marginTop: 2 }}>●</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="feed-root">
      {/* Glow orbs — matches Discover/Feed pages */}
      <div
        className="f-orb"
        style={{ width: 480, height: 480, background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)", top: -140, right: -100 }}
      />
      <div
        className="f-orb"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", bottom: 40, left: -120 }}
      />

      <div className="feed-body" style={{ maxWidth: 720 }}>
        {/* ── Hero ── */}
        <div className="feed-eyebrow">
          <span className="feed-eyebrow-dot" />
          AI Resume Builder
        </div>
        <h1 className="feed-title">
          Build a resume<br />
          <span className="feed-title-grad">in seconds</span>
        </h1>
        <p className="feed-subtitle" style={{ marginBottom: 28 }}>
          Pulls straight from your profile — skills, projects, certifications, all of it.
        </p>

        {/* ── Profile preview card ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: "28px 24px",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <img
            src={user.photoUrl}
            alt="profile"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(124,58,237,0.5)",
              boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              marginBottom: 14,
            }}
          />
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 4,
            }}
          >
            {user.firstName} {user.lastName}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", marginBottom: 12 }}>{user.emailId}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {user.githubProfileUrl && (
              <a
                href={user.githubProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="conn-social-link"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(165,180,252,0.85)", textDecoration: "none",
                }}
              >
                <Github size={13} /> GitHub
              </a>
            )}
            {user.linkedIn && (
              <a
                href={user.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="conn-social-link"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(165,180,252,0.85)", textDecoration: "none",
                }}
              >
                <Linkedin size={13} /> LinkedIn
              </a>
            )}
            {user.leetcodeId && (
              <a
                href={user.leetcodeId}
                target="_blank"
                rel="noreferrer"
                className="conn-social-link"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(165,180,252,0.85)", textDecoration: "none",
                }}
              >
                <Code2 size={13} /> LeetCode
              </a>
            )}
          </div>
        </div>

        {/* ── Generate button ── */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 14,
            border: "none",
            background: loading
              ? "rgba(124,58,237,0.3)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14.5,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: loading ? "none" : "0 0 28px rgba(124,58,237,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? "Generating resume…" : "Generate resume"}
        </button>

        {error && (
          <p style={{ color: "#fca5a5", fontSize: 13, marginTop: 10, textAlign: "center" }}>{error}</p>
        )}

        {/* ── Generated result ── */}
        {resume && (
          <div style={{ marginTop: 32 }}>
            <div className="feed-divider" />

            {resume.summary && (
              <Section title="Summary">
                <p style={{ fontSize: 13.5, color: "rgba(226,232,240,0.85)", lineHeight: 1.7 }}>
                  {resume.summary}
                </p>
              </Section>
            )}

            {resume.skillsBullets?.length > 0 && (
              <Section title="Skills">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {resume.skillsBullets.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 13px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: "rgba(124,58,237,0.12)",
                        border: "1px solid rgba(124,58,237,0.25)",
                        color: "#c4b5fd",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {resume.experienceBullets?.length > 0 && (
              <Section title="Experience">
                <BulletList items={resume.experienceBullets} />
              </Section>
            )}

            {educationList.length > 0 && (
              <Section title="Education">
                <BulletList
                  items={educationList.map(
                    (ed, i) =>
                      `${ed.degree || ed.school || ""}${ed.institution ? ` – ${ed.institution}` : ""}${
                        ed.percentage ? ` (${ed.percentage}%)` : ed.sgpa ? ` (${ed.sgpa} SGPA)` : ""
                      }`
                  )}
                />
              </Section>
            )}

            {projectsList.length > 0 && (
              <Section title="Projects">
                <BulletList items={projectsList} />
              </Section>
            )}

            {certificationsList.length > 0 && (
              <Section title="Certifications">
                <BulletList items={certificationsList} />
              </Section>
            )}

            {/* ── Download PDF ── */}
            <PDFDownloadLink
              document={<MyResumePDF user={user} resume={resume} />}
              fileName={`${user.firstName}_${user.lastName}_resume.pdf`}
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "13px 0",
                  marginTop: 8,
                  borderRadius: 14,
                  border: "1px solid rgba(52,211,153,0.35)",
                  background: "rgba(52,211,153,0.12)",
                  color: "#6ee7b7",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(52,211,153,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(52,211,153,0.12)";
                }}
              >
                <Download size={16} /> Download PDF
              </button>
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResumeBuilder;