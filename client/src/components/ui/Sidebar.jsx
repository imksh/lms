import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activeCourseKey, handleCourseChange, topicsList, currentPath, className }) => {
  return (
    <aside className={`w-80 bg-base-200 border-r border-base-300 flex flex-col shrink-0 overflow-y-auto h-full ${className || "hidden lg:flex animate-slideIn"}`}>
      {/* Syllabus Course Selector */}
      <div className="p-4 border-b border-base-300 bg-base-200/50 flex flex-col gap-2 shrink-0">
        <label className="text-[10px] font-black tracking-wider text-base-content/60 uppercase">
          Select learning path
        </label>
        <select 
          className="select select-sm select-bordered w-full rounded-xl bg-base-100 font-bold focus:border-primary text-xs"
          value={activeCourseKey}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="javascript">JavaScript Basics</option>
          <option value="react">React Masterclass</option>
          <option value="node">Node.js Server</option>
          <option value="express">Express API Framework</option>
          <option value="mongodb">MongoDB NoSQL</option>
          <option value="mongoose">Mongoose ODM</option>
          <option value="authentation">Auth & Session JWT</option>
        </select>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {topicsList.map((topic, index) => {
          const isActive = currentPath === topic.path;

          return (
            <div 
              key={topic.path}
              className={`group flex items-center justify-between rounded-xl p-2.5 transition-all ${
                isActive 
                  ? "bg-primary text-primary-content shadow-md shadow-primary/20 font-medium" 
                  : "hover:bg-base-300/80 bg-transparent text-base-content/80"
              }`}
            >
              <Link 
                to={topic.path}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                  isActive ? "bg-primary-content/20 text-primary-content" : "bg-base-300 text-base-content/60"
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="truncate text-sm font-semibold">{topic.title.replace(/^\d+\.\s*/, "")}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
