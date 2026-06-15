import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { SKILL_SUGGESTIONS } from "../../constants/skills";

const SkillSuggestions = ({
  currentSkills,
  onAdd,
}) => {
  const [activeCategory, setActiveCategory] =
    useState("Frontend");

   return (
     <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.05)" }}>
       <div className="px-4 pt-3 pb-2">
         <div className="text-[10px] font-bold uppercase mb-2" style={{ color: "#a5b4fc", letterSpacing: "0.12em" }}>💡 Skill Suggestions</div>
         <div className="flex flex-wrap gap-1 mb-3">
           {Object.keys(SKILL_SUGGESTIONS).map(cat => (
             <button key={cat}
               onClick={() => setActiveCategory(cat)}
               className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all duration-150"
               style={{
                 background: activeCategory === cat ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.04)",
                 color: activeCategory === cat ? "#c7d2fe" : "rgba(148,163,184,0.5)",
                 border: activeCategory === cat ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
               }}
             >{cat}</button>
           ))}
         </div>
         <div className="flex flex-wrap gap-1.5">
           {SKILL_SUGGESTIONS[activeCategory].map(skill => {
             const already = currentSkills.includes(skill);
             return (
               <button key={skill}
                 onClick={() => !already && onAdd(skill)}
                 disabled={already || currentSkills.length >= 10}
                 className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-150 border-none"
                 style={{
                   background: already ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
                   color: already ? "#34d399" : "rgba(148,163,184,0.65)",
                   border: already ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.08)",
                   opacity: (!already && currentSkills.length >= 10) ? 0.4 : 1,
                 }}
               >
                 {already ? <Check size={9} /> : <Plus size={9} />}
                 {skill}
               </button>
             );
           })}
         </div>
       </div>
     </div>
  );
};

export default SkillSuggestions;