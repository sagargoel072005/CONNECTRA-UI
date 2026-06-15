import { useRef } from "react";
import {
  Upload,
  FileText,
  ExternalLink,
} from "lucide-react";

const ResumeUpload = ({
  resumeUrl,
  onUpload,
  uploading,
}) => {
  const inputRef = useRef(null);

  return ( <div> {resumeUrl ? ( <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)" }}> <div className="flex items-center gap-2.5"> <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(52,211,153,0.15)" }}> <FileText size={15} style={{ color: "#34d399" }} /> </div> <div> <div className="text-sm font-semibold" style={{ color: "#34d399" }}>Resume Uploaded</div> <div className="text-[11px]" style={{ color: "rgba(148,163,184,0.45)" }}>Click to view or replace</div> </div> </div> <div className="flex items-center gap-2"> <a href={resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium no-underline" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }} ><ExternalLink size={11} /> View</a> <button onClick={() => inputRef.current.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }} ><Upload size={11} /> Replace</button> </div> </div> ) : ( <button onClick={() => inputRef.current.click()} className="w-full rounded-xl py-6 border-none cursor-pointer transition-all duration-200 flex flex-col items-center gap-3" style={{ background: "rgba(255,255,255,0.02)", border: "2px dashed rgba(99,102,241,0.25)" }} onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"} > {uploading ? ( <div className="prof-spinner" /> ) : ( <> <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}> <Upload size={20} style={{ color: "#818cf8" }} /> </div> <div> <div className="text-sm font-semibold" style={{ color: "#a5b4fc" }}>Upload Resume / CV</div> <div className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.4)" }}>PDF, DOC, DOCX — max 5MB</div> </div> </> )} </button> )} <input type="file" ref={inputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={onUpload} /> </div>
  );
};

export default ResumeUpload;