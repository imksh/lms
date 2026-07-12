import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  LogOut,
  Settings,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useAuthStore } from "../../store/useAuthStore";

const Header = ({ saveStatus, theme, toggleTheme }) => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const roleLabel = {
    admin: "Admin",
    teacher: "Teacher",
    student: "Student",
    user: "Student",
  };

  return (
    <header className="h-16 bg-base-200/90 backdrop-blur-md border-b border-base-300 px-6 py-4 flex items-center justify-between shrink-0 z-40">
      {/* Left — Logo */}
      <div className="flex items-center gap-1">
        {/* <button
          onClick={toggleSidebar}
          className="lg:hidden btn btn-square btn-ghost border border-base-300 bg-base-100 hover:bg-base-200"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-base-content" />
        </button> */}
        <Link to="/lms" className="flex items-center gap-2 group">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSidebar();
            }}
            className="btn btn-primary btn-circle cursor-pointer flex md:hidden"
          >
            <GraduationCap size={24} />
          </div>
          <div className="btn btn-primary btn-circle cursor-pointer hidden md:flex">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-black text-primary group-hover:scale-105 transition-transform">
            LMS
          </h1>
        </Link>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-3">
        <Link
          to="/playground"
          className="btn btn-sm btn-primary btn-soft rounded-xl font-semibold flex gap-1.5 items-center hover:scale-[1.02] active:scale-[0.98] transition-transform text-xs border! border-primary"
        >
          Playground
        </Link>

        {user ? (
          <Link
            to={
              user.role === "admin"
                ? "/admin"
                : user.role === "teacher"
                  ? "/teacher"
                  : "/profile"
            }
            className="btn btn-sm btn-circle bg-primary text-primary-content font-bold text-[10px] shadow-md border border-primary/20 hover:scale-105 transition-transform"
            title="View Profile"
          >
            {getInitials(user.name || "User")}
          </Link>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-sm btn-outline border-base-300 text-base-content rounded-xl font-bold hover:bg-base-200 active:scale-[0.98] transition-transform text-xs"
            >
              Sign In
            </button>
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
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
