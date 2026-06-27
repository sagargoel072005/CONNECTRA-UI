import { useEffect, useRef } from "react";

const AboutUs = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    for (let i = 0; i < 60; i++) {
      const star = document.createElement("div");
      const size = Math.random() > 0.8 ? "3px" : "2px";
      star.style.cssText = `
        position: absolute;
        width: ${size};
        height: ${size};
        background: rgba(255,255,255,${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        pointer-events: none;
      `;
      root.appendChild(star);
    }
  }, []);

  const sections = [
    {
      icon: "✦",
      title: "Who we are",
      body: "Connectra is a professional network built for developers — a space to discover collaborators, showcase your work, and build the future together. We're not another social platform; we're infrastructure for shipping.",
    },
    {
      icon: "◈",
      title: "Our mission",
      body: "We believe the best software is built by people who find each other at the right time. Our mission is to remove the friction between talented builders and meaningful work, so more great things get made.",
    },
    {
      icon: "◇",
      title: "Our vision",
      body: "A world where every developer — regardless of geography or background — has access to the collaborators, visibility, and tools they need to ship products that matter.",
    },
  ];

  return (
    <div
      ref={rootRef}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #060414 0%, #0d0b2e 40%, #0a0820 70%, #050210 100%)",
        color: "white",
        padding: "clamp(48px, 10vw, 80px) clamp(16px, 4vw, 24px) clamp(40px, 8vw, 60px)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ambient glows */}
      <div style={{
        position: "absolute", top: "-80px", left: "-80px",
        width: "420px", height: "420px",
        background: "radial-gradient(circle, rgba(99,78,220,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", right: "-60px",
        width: "380px", height: "380px",
        background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "60%",
        width: "260px", height: "260px",
        background: "radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#a5b4fc",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            padding: "6px 16px", borderRadius: "999px",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#818cf8", display: "inline-block",
            }} />
            About Connectra
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          textAlign: "center",
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: "16px",
          letterSpacing: "-0.02em",
        }}>
          <span style={{ color: "#e0e7ff" }}>Where builders </span>
          <span style={{
            background: "linear-gradient(90deg, #818cf8, #a78bfa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>connect & ship</span>
        </h1>

        <p style={{
          textAlign: "center",
          color: "rgba(165,180,252,0.6)",
          fontSize: "15px",
          lineHeight: 1.7,
          maxWidth: "480px",
          margin: "0 auto 56px",
        }}>
          Learn more about who we are, what we do, and why Connectra exists.
        </p>

        {/* Main card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "clamp(20px, 5vw, 40px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>

          {/* Top divider label */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "11px", color: "rgba(165,180,252,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Our story
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {sections.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "20px" }}>
                {/* Icon node */}
                <div style={{
                  flexShrink: 0,
                  width: "38px", height: "38px",
                  borderRadius: "10px",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", color: "#818cf8",
                  marginTop: "2px",
                }}>
                  {s.icon}
                </div>
                <div>
                  <h2 style={{
                    fontSize: "15px", fontWeight: 600,
                    color: "#c7d2fe", marginBottom: "8px", letterSpacing: "-0.01em",
                  }}>
                    {s.title}
                  </h2>
                  <p style={{
                    fontSize: "14px", color: "rgba(165,180,252,0.6)",
                    lineHeight: 1.75, margin: 0,
                  }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Why choose us */}
          <div style={{
            marginTop: "40px", paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}>
            <h2 style={{
              fontSize: "15px", fontWeight: 600,
              color: "#c7d2fe", marginBottom: "16px",
            }}>
              Why builders choose Connectra
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}>
              {[
                { icon: "⬡", label: "Intuitive by design" },
                { icon: "⬡", label: "Secure & reliable" },
                { icon: "⬡", label: "Fast delivery" },
                { icon: "⬡", label: "Dedicated support" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.12)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                }}>
                  <span style={{ color: "#818cf8", fontSize: "14px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "rgba(199,210,254,0.8)", fontWeight: 500 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div style={{
            marginTop: "36px", paddingTop: "28px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "16px",
          }}>
            <div>
              <p style={{ fontSize: "13px", color: "rgba(165,180,252,0.5)", margin: "0 0 4px" }}>
                Have questions or want to collaborate?
              </p>
              <p style={{ fontSize: "14px", color: "#a5b4fc", fontWeight: 500, margin: 0 }}>
                support@Connectra.com
              </p>
            </div>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none",
              padding: "10px 22px", borderRadius: "10px",
              fontSize: "13px", fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.01em",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}>
              Get in touch
              <span style={{ fontSize: "16px" }}>→</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          fontSize: "12px",
          color: "rgba(165,180,252,0.3)",
          marginTop: "36px",
        }}>
          © 2026 Connectra · Building better connections
        </p>
      </div>
    </div>
  );
};

export default AboutUs;