import { useState } from "react";
import { motion } from "framer-motion";

const FInput = ({
    label,
    value,
    onChange,
    type = "text",
    multiline,
    icon,
    placeholder,
}) => {
    const [focused, setFocused] = useState(false);

    const active =
        focused ||
        (value !== "" &&
            value !== undefined &&
            value !== null &&
            value !== 0);

    return (<div className="relative mb-4"> 
        <div className="absolute -inset-px rounded-[13px] z-0 transition-all duration-300" style={{ background: focused ? "linear-gradient(135deg,#6366f1,#8b5cf6,#60a5fa)" : "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))", opacity: focused ? 1 : 0.5, }} /> <div className="relative z-10 rounded-xl flex backdrop-blur-xl" style={{ background: "rgba(8,8,28,0.85)", alignItems: multiline ? "flex-start" : "center" }} > {icon && (<span className="flex-shrink-0 transition-colors duration-300" style={{ padding: multiline ? "16px 10px 0 14px" : "0 10px 0 14px", color: focused ? "#818cf8" : "rgba(148,163,184,0.4)", fontSize: 15, }}>{icon}</span>)} <div className="flex-1 relative" style={{ paddingTop: active ? 20 : 0, paddingBottom: active ? 8 : 0, minHeight: multiline ? 90 : 50, display: "flex", alignItems: multiline ? "flex-start" : "center", paddingLeft: icon ? 0 : 14, paddingRight: 14, }} > <motion.label animate={{ top: active ? 8 : multiline ? 16 : "50%", y: active ? 0 : multiline ? 0 : "-50%", fontSize: active ? 9.5 : 13, color: focused ? "#818cf8" : "rgba(148,163,184,0.4)", }} transition={{ duration: 0.18 }} className="absolute left-0 pointer-events-none font-semibold z-20" style={{ fontFamily: "'DM Sans',sans-serif", letterSpacing: active ? "0.09em" : 0, textTransform: active ? "uppercase" : "none" }} >{label}</motion.label> {multiline ? (<textarea value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={active ? placeholder : ""} rows={3} className="w-full bg-transparent border-none outline-none text-slate-200 resize-none text-sm" style={{ fontFamily: "'DM Sans',sans-serif", paddingTop: active ? 4 : 0, lineHeight: 1.65 }} />) : (<input type={type} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={active ? placeholder : ""} className="w-full bg-transparent border-none outline-none text-slate-200 text-sm" style={{ fontFamily: "'DM Sans',sans-serif" }} />)} </div> </div> </div>
    );
};

export default FInput;