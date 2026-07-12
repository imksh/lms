import React from "react";
import { Globe } from "lucide-react";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import * as SiIcons from "react-icons/si";
import * as LuIcons from "lucide-react";

export const getIconComponent = (iconName) => {
  if (typeof iconName !== "string") return iconName;
  if (FaIcons[iconName]) return FaIcons[iconName];
  if (IoIcons[iconName]) return IoIcons[iconName];
  if (SiIcons[iconName]) return SiIcons[iconName];
  if (LuIcons[iconName]) return LuIcons[iconName];
  return LuIcons.BookOpen;
};

const SubjectCard = ({ subj, onNavigate }) => {
  const Icon = getIconComponent(subj.icon);
  return (
    <div
      className={`card border ${subj.color || "border-base-300 bg-base-100"} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl overflow-hidden cursor-pointer relative`}
      onClick={() => onNavigate(subj)}
    >
      {subj.isPublic && (
        <span className="absolute top-3 right-3 badge badge-xs badge-success badge-soft gap-1 text-[10px]">
          <Globe size={9} /> Public
        </span>
      )}
      <div className="card-body p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-3xl p-2 bg-base-100 rounded-xl shadow-inner border border-base-300/40 w-fit">
            <Icon className={subj.iconColor || "text-primary"} />
          </span>
          <h4 className="text-base font-extrabold group-hover:text-primary transition-colors mt-2">
            {subj.title}
          </h4>
          <p className="text-xs text-base-content/70 leading-relaxed min-h-[48px]">
            {subj.desc}
          </p>
        </div>
        <div className="card-actions">
          <span className="text-xs font-black text-primary group-hover:translate-x-1 transition-transform">
            Start Course →
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
