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
        fontSize: 24,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {value}
    </div>

    <div
      className="uppercase mt-1 tracking-widest"
      style={{
        fontSize: 10,
        color: "rgba(148,163,184,0.45)",
      }}
    >
      {label}
    </div>
  </div>
);

export default StatPill;