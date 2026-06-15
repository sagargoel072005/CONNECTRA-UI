import { motion } from "framer-motion";
import { X } from "lucide-react";

const SkillTag = ({ skill, onRemove, accent }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
  >
    {skill}

    {onRemove && (
      <button onClick={onRemove}>
        <X size={11} />
      </button>
    )}
  </motion.div>
);

export default SkillTag;