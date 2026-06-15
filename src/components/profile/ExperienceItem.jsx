import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const ExperienceItem = ({
  exp,
  onRemove,
}) => {
  return (
  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
    className="rounded-xl p-4 mb-3 relative group"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-200">{exp.title}</span>
          {exp.current && <span className="text-[10px] px-2 py-0.5 rounded-md font-bold" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>Current</span>}
        </div>
        <div className="text-xs mt-0.5 font-medium" style={{ color: "#818cf8" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
        <div className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.45)" }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Present" : ""}</div>
        {exp.description && <div className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(148,163,184,0.6)" }}>{exp.description}</div>}
      </div>
      {onRemove && (
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer transition-opacity duration-200" style={{ color: "rgba(252,165,165,0.7)" }}>
          <Trash2 size={13} />
        </button>
      )}
    </div>
  </motion.div>
  );
};

export default ExperienceItem;