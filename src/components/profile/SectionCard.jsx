import { motion } from "framer-motion";

const SectionCard = ({ title, icon, children }) => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: "rgba(8,8,28,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.06), 0 16px 40px rgba(0,0,0,0.4)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(99,102,241,0.04)",
        }}
      >
        <span style={{ color: "#818cf8" }}>{icon}</span>
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">{children}</div>
    </motion.div>
  );
};

export default SectionCard;