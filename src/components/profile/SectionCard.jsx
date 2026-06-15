import { motion } from "framer-motion";

const SectionCard = ({
  title,
  icon,
  children,
  accentColor,
}) => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden mb-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2.5 px-6 py-4">
        <span>{icon}</span>
        <span>{title}</span>
      </div>

      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionCard;