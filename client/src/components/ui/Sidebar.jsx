import React from "react";
import { Link } from "react-router-dom";
import { IoClose, IoLogoJavascript } from "react-icons/io5";
import { FaReact, FaNodeJs, FaShieldAlt } from "react-icons/fa";
import { SiExpress, SiMongodb, SiMongoosedotws } from "react-icons/si";
import { Menu } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";

const subjects = [
  {
    key: "javascript",
    title: "JavaScript Basics",
    icon: IoLogoJavascript,
    iconColor: "text-yellow-500",
  },
  {
    key: "react",
    title: "React Masterclass",
    icon: FaReact,
    iconColor: "text-blue-500",
  },
  {
    key: "node",
    title: "Node.js Server",
    icon: FaNodeJs,
    iconColor: "text-green-500",
  },
  {
    key: "express",
    title: "Express API Framework",
    icon: SiExpress,
    iconColor: "text-purple-500",
  },
  {
    key: "mongodb",
    title: "MongoDB NoSQL",
    icon: SiMongodb,
    iconColor: "text-emerald-600",
  },
  {
    key: "mongoose",
    title: "Mongoose ODM",
    icon: SiMongoosedotws,
    iconColor: "text-orange-500",
  },
  {
    key: "authentation",
    title: "Auth & Session JWT",
    icon: FaShieldAlt,
    iconColor: "text-gray-500",
  },
];

const Sidebar = ({
  activeCourseKey,
  handleCourseChange,
  topicsList,
  currentPath,
  className,
  isTopicPage = true,
}) => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  return (
    <aside
      className={`absolute md:static top-0 z-50 w-80 bg-base-200 border-r border-base-300 flex flex-col shrink-0 overflow-y-auto h-full ${className || "hidden lg:flex animate-slideIn"}`}
    >
      <>
        <header className="md:hidden h-16 bg-base-200/90 backdrop-blur-md border-b border-base-300 px-6 py-4 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl animate-bounce"></span>
              <div>
                <h1 className="text-xl font-black text-primary group-hover:scale-105 transition-transform">
                  LMS
                </h1>
              </div>
            </Link>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden btn btn-square btn-ghost border border-base-300 bg-base-100 hover:bg-base-200"
            aria-label="Open menu"
          >
            <IoClose size={20} className="text-base-content" />
          </button>
        </header>
        {isTopicPage ? (
          <>
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
          <>
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
              {subjects.map((subj) => {
                const Icon = subj.icon;
                return (
                  <button
                    key={subj.key}
                    onClick={() => handleCourseChange(subj.key)}
                    className="w-full text-left group flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-base-300/80 bg-transparent text-base-content/80"
                  >
                    <span className="text-xl p-1.5 bg-base-100 rounded-lg shadow-inner border border-base-300/40 w-fit shrink-0">
                      <Icon className={subj.iconColor} />
                    </span>
                    <span className="truncate text-sm font-bold group-hover:text-primary transition-colors">
                      {subj.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </>
        )}
      </>
    </aside>
  );
};

export default Sidebar;
