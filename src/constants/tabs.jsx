import {
  User,
  Briefcase,
  Link2,
  Cpu,
  Clock,
  GraduationCap,
  FolderGit2,
  FileText,
} from "lucide-react";

export const EDIT_TABS = [
  {
    id: "basic",
    label: "Basic",
    icon: <User size={13} />,
  },
  {
    id: "work",
    label: "Work",
    icon: <Briefcase size={13} />,
  },
  {
    id: "platforms",
    label: "Platforms",
    icon: <Link2 size={13} />,
  },
  {
    id: "skills",
    label: "Skills",
    icon: <Cpu size={13} />,
  },
  {
    id: "experience",
    label: "Experience",
    icon: <Clock size={13} />,
  },
  {
    id: "academics",
    label: "Academics",
    icon: <GraduationCap size={13} />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderGit2 size={13} />,
  },
  {
    id: "resume",
    label: "Resume",
    icon: <FileText size={13} />,
  },
];

export const BLANK_EXP = {
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  employmentType: "",
};
