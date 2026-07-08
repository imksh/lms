import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";

const Header = ({ saveStatus, theme, toggleTheme }) => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <header className="h-16 bg-base-200/90 backdrop-blur-md border-b border-base-300 px-6 py-4 flex items-center justify-between shrink-0 z-40">
      <div className="flex items-center gap-1">
        {/* Hamburger Icon on Phone/Tablet */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden btn btn-square btn-ghost border border-base-300 bg-base-100 hover:bg-base-200"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-base-content" />
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl animate-bounce"></span>
          <div>
            <h1 className="text-xl font-black text-primary group-hover:scale-105 transition-transform">
              LMS
            </h1>
          </div>
        </Link>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {saveStatus && (
          <span className="text-xs text-base-content/50 italic hidden sm:inline-block">
            {saveStatus}
          </span>
        )}

        <Link 
          to="/playground"
          className="btn btn-sm btn-primary btn-soft rounded-xl font-semibold flex gap-1.5 items-center hover:scale-[1.02] active:scale-[0.98] transition-transform text-xs border! border-primary"
        >
          Playground
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-circle btn-ghost border border-base-300 bg-base-100 hover:bg-base-200"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} className="text-base-content" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
