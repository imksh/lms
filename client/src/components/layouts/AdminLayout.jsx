import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Layers,
  BookOpen,
  FileText,
  Inbox,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  Moon,
  Sun,
  Home,
  GraduationCap,
  User,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import useWindowSize from "../../hooks/useWindowSize";

const AdminLayout = ({ children, actions, breadcrumbs, title }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";

  const navGroups = [
    {
      label: "",
      items: [
        {
          id: "cms",
          label: "CMS",
          icon: Layers,
          color: "text-primary",
          roles: ["admin", "teacher"],
        },
        {
          id: "evaluations",
          label: "Evaluations",
          icon: Inbox,
          color: "text-primary",
          roles: ["admin", "teacher"],
        },

        ...(isAdmin
          ? [
              {
                id: "users",
                label: "Users",
                icon: Users,
                color: "text-primary",
                roles: ["admin"],
              },
            ]
          : []),
        {
          id: "profile",
          label: "Profile",
          icon: User,
          color: "text-primary",
          roles: ["admin", "teacher"],
        },
        {
          id: "settings",
          label: "App Settings",
          icon: Settings,
          color: "text-primary",
          roles: ["admin"],
        },
        {
          id: "",
          label: "LMS",
          icon: Home,
          color: "text-primary",
          roles: ["admin", "teacher"],
        },
      ],
    },
  ];

  const currentPath = location.pathname;
  const prefix = isAdmin ? "/admin" : "/teacher";

  const activeItem = navGroups
    .flatMap((g) => g.items)
    .find((i) => {
      if (i.id === "cms") {
        return currentPath.startsWith(`${prefix}/cms`);
      }
      return `${prefix}/${i.id}` === currentPath;
    });
  const activeSectionTitle = activeItem ? activeItem.label : "Dashboard";

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const roleColors = {
    admin: "badge-error",
    teacher: "badge-warning",
    student: "badge-info",
  };

  const SidebarItem = ({ item }) => {
    const path = item.id === "" ? "/lms" : `${prefix}/${item.id}`;
    const active =
      item.id === "cms"
        ? currentPath.startsWith(`${prefix}/cms`)
        : currentPath === path;
    const Icon = item.icon;
    return (
      <Link
        to={path}
        onClick={() => setMobileOpen(false)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
          active
            ? "bg-primary text-primary-content shadow-lg shadow-primary/25"
            : "text-base-content/60 hover:text-base-content hover:bg-base-300/60"
        }`}
        title={collapsed ? item.label : ""}
      >
        <Icon
          size={18}
          className={`shrink-0 transition-colors ${active ? "text-primary-content" : item.color}`}
        />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge != null && (
              <span className="ml-auto badge badge-warning badge-xs font-bold">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-base-300/50 shrink-0 ${collapsed ? "justify-center" : ""}`}
      >
        <div
          className={`w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 ${collapsed ? "mr-auto" : ""}`}
        >
          <GraduationCap size={16} className="text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-black text-primary truncate">
              LMS Admin
            </p>
            {/* <p className="text-[10px] text-base-content/40 truncate">
              {isAdmin ? "Administrator" : "Teacher"} Panel
            </p> */}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 mt-1">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.roles || item.roles.includes(user?.role),
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} className="space-y-1">
              {visibleItems.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <button
        onClick={() => setTheme((p) => (p === "dark" ? "light" : "dark"))}
        className={`w-full flex items-center gap-3 px-3 py-2.5 md:px-4 text-sm font-semibold transition-all duration-150 text-base-content/60 hover:text-base-content hover:bg-base-300/60 justify-between rounded-none ${collapsed ? "justify-center" : ""}`}
        title="Toggle Theme"
      >
        {!collapsed && (
          <span>Theme: {theme === "dark" ? "Dark" : "Light"}</span>
        )}
        {theme === "dark" ? (
          <Sun size={18} className="shrink-0" />
        ) : (
          <Moon size={18} className="shrink-0" />
        )}
      </button>
      <div className="hidden p-3 border-t border-base-300/50 shrink-0 md:flex flex-col gap-2">
        <button
          onClick={() => setCollapsed((p) => !p)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-base-content/60 hover:text-base-content hover:bg-base-300/60 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} className="shrink-0 mr-auto" />
          ) : (
            <ChevronLeft size={18} className="shrink-0" />
          )}
          {!collapsed && <span className="truncate">Collapse</span>}
        </button>
      </div>
      <div className=" p-3 border-t border-base-300/50 shrink-0 flex flex-col gap-2">
        <button
          onClick={logout}
          className={`w-full btn btn-error btn-sm`}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-base-100 text-base-content flex font-sans">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-base-300/60 bg-base-200/70 backdrop-blur-sm transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <aside className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-base-200 border-r border-base-300 flex flex-col shadow-2xl lg:hidden">
          <SidebarContent />
        </aside>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-base-200/60 backdrop-blur-sm border-b border-base-300/60 px-4 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden btn btn-sm bg-base-100 border-none text-base-content btn-square"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {size.width > 648 && breadcrumbs ? (
                breadcrumbs
              ) : (
                <span className="text-base font-black text-base-content tracking-tight truncate">
                  {title || activeSectionTitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">{actions}</div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
