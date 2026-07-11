import React from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import * as SiIcons from "react-icons/si";
import * as LuIcons from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";

const getIconComponent = (iconName) => {
  if (FaIcons[iconName]) return FaIcons[iconName];
  if (IoIcons[iconName]) return IoIcons[iconName];
  if (SiIcons[iconName]) return SiIcons[iconName];
  if (LuIcons[iconName]) return LuIcons[iconName];
  return LuIcons.BookOpen;
};

const Sidebar = ({
  activeCourseKey,
  handleCourseChange,
  topicsList,
  currentPath,
  className,
  isTopicPage = true,
  subjectsList = [],
  modulesList = [],
}) => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  // Group subjects by their module — subjects without a module go into "General"
  const grouped = (() => {
    if (modulesList.length === 0) {
      return [{ module: null, subjects: subjectsList }];
    }
    const result = [];
    for (const mod of modulesList) {
      const subs = subjectsList.filter(
        (s) => s.module && (s.module._id === mod._id || s.module === mod._id),
      );
      if (subs.length > 0) result.push({ module: mod, subjects: subs });
    }
    const unassigned = subjectsList.filter((s) => !s.module);
    if (unassigned.length > 0) result.push({ module: null, subjects: unassigned });
    return result;
  })();

  return (
    <aside
      className={className || "absolute md:static top-0 z-50 w-80 bg-base-200 border-r border-base-300 flex flex-col shrink-0 h-full hidden lg:flex animate-slideIn"}
    >
      <>
        <header className="md:hidden h-16 bg-base-200/90 backdrop-blur-md border-b border-base-300 px-6 py-4 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl animate-bounce">📚</span>
              <h1 className="text-xl font-black text-primary group-hover:scale-105 transition-transform">
                LMS
              </h1>
            </Link>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden btn btn-square btn-ghost border border-base-300 bg-base-100 hover:bg-base-200"
            aria-label="Close menu"
          >
            <IoClose size={20} className="text-base-content" />
          </button>
        </header>

        {isTopicPage ? (
          <>
            {/* Subject selector with module grouping */}
            <div className="p-4 border-b border-base-300 bg-base-200/50 flex flex-col gap-2 shrink-0">
              <label className="text-[10px] font-black tracking-wider text-base-content/60 uppercase">
                Select learning path
              </label>
              <select
                className="select select-sm select-bordered w-full rounded-xl bg-base-100 font-bold focus:border-primary text-xs"
                value={activeCourseKey}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                {grouped.map(({ module, subjects }) => (
                  module ? (
                    <optgroup key={module._id} label={module.title}>
                      {subjects.map((subj) => (
                        <option key={subj.key} value={subj.key}>
                          {subj.title}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    subjects.map((subj) => (
                      <option key={subj.key} value={subj.key}>
                        {subj.title}
                      </option>
                    ))
                  )
                ))}
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
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                          isActive
                            ? "bg-primary-content/20 text-primary-content"
                            : "bg-base-300 text-base-content/60"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm font-semibold">
                        {topic.title.replace(/^\d+\.\s*/, "")}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </>
        ) : (
          /* Home page — show all modules with their subjects */
          <nav className="flex-1 p-3 overflow-y-auto">
            {grouped.map(({ module, subjects }, gIdx) => (
              <div key={module?._id ?? "unassigned"} className={gIdx > 0 ? "mt-4" : ""}>
                {module && (
                  <div className="px-2 py-1.5 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-[10px] font-black tracking-wider text-primary uppercase truncate">
                      {module.title}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  {subjects.map((subj) => {
                    const Icon = getIconComponent(subj.icon);
                    return (
                      <button
                        key={subj.key}
                        onClick={() => handleCourseChange(subj.key)}
                        className="w-full text-left group flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-base-300/80 bg-transparent text-base-content/80"
                      >
                        <span className="text-xl p-1.5 bg-base-100 rounded-lg shadow-inner border border-base-300/40 w-fit shrink-0">
                          <Icon className={subj.iconColor || "text-primary"} />
                        </span>
                        <span className="truncate text-sm font-bold group-hover:text-primary transition-colors">
                          {subj.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        )}
      </>
    </aside>
  );
};

export default Sidebar;
