import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  Mail,
  Lock,
  Save,
  CheckCircle,
  Award,
  BookOpen,
  Inbox,
  Activity,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { authService } from "../../services/authService";
import { inputCls } from "../../components/common/SharedFields";
import AdminLayout from "../../components/layouts/AdminLayout";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await authService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setStatsLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus({ type: "", message: "" });

    // Only send password if it was filled out
    const updates = { name: formData.name, email: formData.email };
    if (formData.password) updates.password = formData.password;

    const success = await updateProfile(updates);

    if (success) {
      setFormStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setFormData((prev) => ({ ...prev, password: "" })); // Clear password field
    } else {
      setFormStatus({
        type: "error",
        message: "Failed to update profile. Email might be in use.",
      });
    }
    setFormLoading(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const isStudent = user.role === "student";
  const isLayoutWrapped = user.role === "admin" || user.role === "teacher";

  const renderContent = () => {
    return (
      <div
        className={`w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-7 gap-6  lg:gap-8 ${isLayoutWrapped ? "max-w-7xl" : "max-w-5xl"}`}
      >
        {/* Left Column - User Info & Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Identity Card */}
          <div className="card bg-base-100 border border-base-300 shadow-sm rounded-3xl overflow-hidden relative">
            <div className="h-24 bg-gradient-to-br from-primary/80 to-secondary/80 absolute top-0 left-0 right-0"></div>
            <div className="card-body items-center text-center pt-12 relative ">
              <div className="avatar placeholder mb-2">
                <div className="w-24 h-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 bg-primary text-primary-content shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-black leading-none">
                      {getInitials(user.name)}
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="card-title text-2xl font-black text-base-content">
                {user.name}
              </h2>
              <p className="text-base-content/60 text-sm font-medium">
                {user.email}
              </p>

              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline border-error/50 hover:bg-error hover:border-error text-error hover:text-error-content rounded-xl mt-4 w-full flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card bg-base-100 border border-base-300 shadow-sm rounded-3xl">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base-content/70 text-sm tracking-wider uppercase flex items-center gap-2">
                  <Activity size={16} /> Activity & Stats
                </h3>
                <span
                  className={`badge badge-sm font-bold shadow-sm ${
                    user.role === "admin"
                      ? "badge-error"
                      : user.role === "teacher"
                        ? "badge-warning"
                        : "badge-primary"
                  }`}
                >
                  {user.role.toUpperCase()}
                </span>
              </div>

              {statsLoading ? (
                <div className="flex justify-center py-6">
                  <span className="loading loading-dots loading-md text-primary"></span>
                </div>
              ) : stats ? (
                <div className="grid grid-cols-3 gap-3">
                  {isStudent ? (
                    <>
                      <div className="bg-base-200/50 rounded-2xl p-4 text-center border border-base-300/50">
                        <Award
                          size={24}
                          className="mx-auto mb-1 text-warning"
                        />
                        <div className="text-2xl font-black text-base-content">
                          {stats.totalPoints || 0}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-base-content/50">
                          Points
                        </div>
                      </div>
                      <div className="bg-base-200/50 rounded-2xl p-4 text-center border border-base-300/50">
                        <CheckCircle
                          size={24}
                          className="mx-auto mb-1 text-success"
                        />
                        <div className="text-2xl font-black text-base-content">
                          {stats.completedTopics || 0}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-base-content/50">
                          Completed
                        </div>
                      </div>
                      <div className="bg-base-200/50 rounded-2xl p-4 text-center border border-base-300/50">
                        <Inbox
                          size={24}
                          className="mx-auto mb-1 text-primary"
                        />
                        <div className="text-2xl font-black text-base-content">
                          {stats.totalSubmissions || 0}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-base-content/50">
                          Total Submissions
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-base-200/50 rounded-2xl p-4 text-center border border-base-300/50">
                        <BookOpen
                          size={24}
                          className="mx-auto mb-1 text-primary"
                        />
                        <div className="text-2xl font-black text-base-content">
                          {stats.totalSubjects || 0}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-base-content/50">
                          Subjects
                        </div>
                      </div>
                      <div className="bg-base-200/50 rounded-2xl p-4 text-center border border-base-300/50">
                        <Inbox
                          size={24}
                          className="mx-auto mb-1 text-rose-500"
                        />
                        <div className="text-2xl font-black text-base-content">
                          {stats.pendingEvaluations || 0}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-base-content/50">
                          Pending Eval
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-sm text-base-content/50 py-4">
                  No stats available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Edit Profile */}
        <div className="lg:col-span-4">
          <div className="card bg-base-100 border border-base-300 shadow-sm rounded-3xl h-full">
            <div className="card-body p-6 sm:p-8">
              <h2 className="text-2xl font-black text-base-content mb-1">
                Edit Profile
              </h2>
              <p className="text-sm text-base-content/60 mb-8">
                Update your personal information and password here.
              </p>

              {formStatus.message && (
                <div
                  className={`alert ${formStatus.type === "success" ? "alert-success bg-success/10 text-success border-success/20" : "alert-error bg-error/10 text-error border-error/20"} rounded-xl mb-6 flex gap-3 p-4`}
                >
                  {formStatus.type === "success" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <div className="font-bold">!</div>
                  )}
                  <span className="font-semibold text-sm">
                    {formStatus.message}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-bold text-base-content/80 flex items-center gap-2">
                      <UserIcon size={14} /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-bold text-base-content/80 flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="divider my-6 text-xs font-bold text-base-content/30">
                  SECURITY
                </div>

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-bold text-base-content/80 flex items-center gap-2">
                      <Lock size={14} /> New Password
                    </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Leave blank to keep current password"
                    minLength={6}
                  />
                  <label className="label pt-1.5">
                    <span className="label-text-alt text-base-content/50">
                      Must be at least 6 characters long if you decide to change
                      it.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-xl px-8 font-bold text-primary-content"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLayoutWrapped) {
    return <AdminLayout>{renderContent()}</AdminLayout>;
  }

  return (
    <div className="min-h-dvh overflow-y-auto h-full bg-base-200/50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-base-100 border-b border-base-300 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-circle btn-ghost"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-black text-base-content">
            Profile Settings
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost border border-base-300 bg-base-100 hover:bg-base-200"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} className="text-base-content" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{renderContent()}</main>
    </div>
  );
};

export default Profile;
