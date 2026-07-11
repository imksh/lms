import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  CheckCircle,
  ShieldAlert,
  Shield,
  Trash2,
  ChevronRight,
  Mail,
  Calendar,
  BookOpen,
  UserCheck,
  UserX,
  Hash,
  Save,
  Layers,
} from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { userService } from "../../services/userService";
import { cmsService } from "../../services/cmsService";
import useWindowSize from "../../hooks/useWindowSize";

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const cls =
    role === "admin"
      ? "badge-error"
      : role === "teacher"
        ? "badge-warning"
        : "badge-info";
  return (
    <span className={`badge badge-sm badge-soft font-bold uppercase ${cls}`}>
      {role}
    </span>
  );
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-base-300/40 last:border-0">
    <Icon size={15} className="text-base-content/30 shrink-0" />
    <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider w-20 shrink-0">
      {label}
    </span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

// ─── User Detail Page (full layout content) ───────────────────────────────────
const UserDetailPage = ({ user: initialUser, modules, onBack, onRefresh }) => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [savingModules, setSavingModules] = useState(false);

  // ── Module selection local state (array of _id strings) ──────────────────
  const getAssignedIds = (u) =>
    Array.isArray(u.module)
      ? u.module.map((m) => (typeof m === "object" ? String(m._id) : String(m)))
      : [];

  const [selectedModuleIds, setSelectedModuleIds] = useState(() => getAssignedIds(initialUser));

  // Track if selection changed from what's saved
  const savedIds = getAssignedIds(user);
  const isDirty =
    JSON.stringify([...selectedModuleIds].sort()) !==
    JSON.stringify([...savedIds].sort());

  const toggleModule = (id) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const saveModules = async () => {
    setSavingModules(true);
    try {
      const { data } = await userService.assignModules(user._id, selectedModuleIds);
      setUser(data);
      setSelectedModuleIds(getAssignedIds(data));
      onRefresh();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setSavingModules(false);
    }
  };

  // ── Generic action runner ─────────────────────────────────────────────────
  const run = async (fn) => {
    setLoading(true);
    try {
      const { data } = await fn();
      setUser(data);
      setSelectedModuleIds(getAssignedIds(data));
      onRefresh();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = () =>
    run(() => userService.approveUser(user._id, !user.isApproved));

  const toggleRole = () => {
    const next = user.role === "student" ? "teacher" : "student";
    if (!confirm(`Change role to ${next}?`)) return;
    run(() => userService.updateRole(user._id, next));
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${user.name}"? This cannot be undone.`))
      return;
    setLoading(true);
    try {
      await userService.deleteUser(user._id);
      onRefresh();
      onBack();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
      setLoading(false);
    }
  };

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const assignedModuleNames = Array.isArray(user.module) && user.module.length > 0
    ? user.module.map((m) => (typeof m === "object" ? m.title : m)).join(", ")
    : null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Avatar card ── */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col items-center gap-4 text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary text-3xl">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-extrabold text-lg leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-base-content/50 mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <RoleBadge role={user.role} />
              {user.isApproved ? (
                <span className="badge badge-xs badge-success badge-soft gap-1 font-bold">
                  <CheckCircle size={9} /> Active
                </span>
              ) : (
                <span className="badge badge-xs badge-warning badge-soft gap-1 font-bold">
                  <ShieldAlert size={9} /> Pending
                </span>
              )}
            </div>
          </div>

          {/* Account info */}
          <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-1">
            <p className="text-xs font-extrabold text-base-content/40 uppercase tracking-wider mb-2">
              Account Info
            </p>
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Calendar} label="Joined" value={joinDate} />
            <InfoRow
              icon={Layers}
              label="Modules"
              value={
                assignedModuleNames ? (
                  <span className="text-xs leading-snug">{assignedModuleNames}</span>
                ) : (
                  <span className="text-base-content/30 italic">None assigned</span>
                )
              }
            />
            <InfoRow
              icon={Hash}
              label="ID"
              value={
                <code className="text-[11px] text-base-content/40 font-mono">
                  {user._id}
                </code>
              }
            />
          </div>
        </div>

        {/* ── Right: Management panels ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* ── Module assignment (checkboxes) ── */}
          {user.role !== "admin" && (
            <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4">
              {/* Header + Save button */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-sm">Class / Module Assignment</p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Select one or more modules to grant access. Click Save to apply.
                  </p>
                </div>
                <button
                  disabled={savingModules || !isDirty}
                  onClick={saveModules}
                  className="btn btn-sm btn-primary rounded-xl font-bold shrink-0 flex gap-1.5 items-center"
                >
                  {savingModules ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <><Save size={13} /> Save</>
                  )}
                </button>
              </div>

              {/* Module checkbox list */}
              {modules.length === 0 ? (
                <p className="text-xs text-base-content/40 italic">No modules created yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {modules.map((m) => {
                    const checked = selectedModuleIds.includes(String(m._id));
                    return (
                      <label
                        key={m._id}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                          checked
                            ? "border-primary/50 bg-primary/5"
                            : "border-base-300/40 bg-base-200/40 hover:border-base-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-primary rounded-lg"
                          checked={checked}
                          onChange={() => toggleModule(String(m._id))}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-tight">{m.title}</p>
                          {m.description && (
                            <p className="text-[11px] text-base-content/40 mt-0.5 truncate">
                              {m.description}
                            </p>
                          )}
                        </div>
                        {m.isPublic && (
                          <span className="badge badge-xs badge-success gap-1 shrink-0">
                            Public
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Unsaved changes hint */}
              {isDirty && (
                <p className="text-[11px] text-warning font-semibold">
                  ⚠ Unsaved changes — click Save to apply
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          {user.role !== "admin" && (
            <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4">
              <div>
                <p className="font-extrabold text-sm">Account Actions</p>
                <p className="text-xs text-base-content/50 mt-1">
                  Manage access and permissions for this user.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Approve/Revoke */}
                <button
                  disabled={loading}
                  onClick={toggleApproval}
                  className={`btn btn-sm rounded-xl font-bold flex gap-2 items-center justify-center ${
                    user.isApproved
                      ? "btn-outline border-base-300 hover:bg-error/10 hover:text-error hover:border-error"
                      : "btn-success"
                  }`}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : user.isApproved ? (
                    <>
                      <UserX size={14} /> Revoke Access
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} /> Approve Access
                    </>
                  )}
                </button>

                {/* Toggle Role */}
                <button
                  disabled={loading}
                  onClick={toggleRole}
                  className="btn btn-sm btn-primary rounded-xl font-bold flex gap-2 items-center justify-center"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <>
                      <Shield size={14} />
                      {user.role === "student"
                        ? "Promote to Teacher"
                        : "Demote to Student"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Danger zone */}
          {user.role !== "admin" && (
            <div className="card border border-error/25 bg-error/5 rounded-3xl p-6 flex flex-col gap-4">
              <div>
                <p className="font-extrabold text-sm text-error/80">
                  Danger Zone
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  Permanently delete this user. All their progress, submissions,
                  and data will be removed and cannot be recovered.
                </p>
              </div>
              <button
                disabled={loading}
                onClick={handleDelete}
                className="btn btn-sm btn-error btn-outline rounded-xl font-bold flex gap-2 items-center justify-center w-fit"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <Trash2 size={14} /> Delete User
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── User List ────────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const size = useWindowSize();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeTab === "pending") {
        filters.isApproved = false;
        filters.role = "student";
      } else if (activeTab === "students") {
        filters.role = "student";
        filters.isApproved = true;
      } else if (activeTab === "teachers") {
        filters.role = "teacher";
        filters.isApproved = true;
      }
      if (selectedModuleId) filters.module = selectedModuleId;

      const [{ data: usersData }, { data: modulesData }] = await Promise.all([
        userService.getUsers(filters),
        cmsService.getModules(),
      ]);
      setUsers(usersData);
      setModules(modulesData);
    } catch (e) {
      console.error("Error fetching users data:", e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedModuleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { id: "all", label: size.width > 560 ? "All Users" : "All" },
    { id: "pending", label: size.width > 560 ? "Pending Approval" : "Pending" },
    { id: "students", label: "Students" },
    { id: "teachers", label: "Teachers" },
  ];

  // ── Breadcrumb passed to AdminLayout header ───────────────────────────────
  const breadcrumbs = (
    <div className="flex items-center gap-1.5 text-sm">
      <button
        onClick={() => setSelectedUser(null)}
        className={`font-semibold transition-colors ${
          selectedUser
            ? "text-base-content/50 hover:text-primary"
            : "font-black text-base-content"
        }`}
      >
        Users
      </button>
      {selectedUser && (
        <>
          <ChevronRight size={13} className="text-base-content/30" />
          <span className="font-black text-base-content">
            {selectedUser.name}
          </span>
        </>
      )}
    </div>
  );

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      {/* ── User Detail Full Page ── */}
      {selectedUser ? (
        <UserDetailPage
          user={selectedUser}
          modules={modules}
          onBack={() => setSelectedUser(null)}
          onRefresh={fetchData}
        />
      ) : (
        /* ── User List ── */
        <div className="p-4 md:p-6 flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            {/* Tabs */}
            <div className="tabs tabs-box bg-base-200 p-1 rounded-2xl flex gap-1 border border-base-300 w-full sm:w-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setSelectedModuleId("");
                  }}
                  className={`tab tab-sm rounded-xl px-3 py-2 text-xs font-bold transition-all flex-1 sm:flex-none ${
                    activeTab === t.id
                      ? "tab-active bg-primary text-primary-content!"
                      : ""
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Module filter */}
            {activeTab !== "teachers" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-base-content/50 uppercase tracking-wider shrink-0">
                  Class:
                </label>
                <select
                  className="select select-sm select-bordered rounded-xl bg-base-200 font-bold text-xs w-full sm:w-44"
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                >
                  <option value="">All Classes</option>
                  <option value="unassigned">Unassigned Only</option>
                  {modules.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Users list */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="bg-base-200/50 border border-dashed border-base-300 rounded-3xl p-16 text-center flex flex-col items-center gap-2 text-base-content/40">
              <Users size={36} />
              <p className="font-extrabold text-base">No users found</p>
              <p className="text-xs">
                No accounts match the current filter criteria.
              </p>
            </div>
          ) : (
            <div className="card bg-base-200/40 border border-base-300/60 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-xs">
                  <thead>
                    <tr className="border-b border-base-300/60 bg-base-200/80">
                      <th className="font-extrabold text-base-content/50 uppercase">
                        User
                      </th>
                      <th className="font-extrabold text-base-content/50 uppercase">
                        Role
                      </th>
                      <th className="font-extrabold text-base-content/50 uppercase hidden sm:table-cell">
                        Class
                      </th>
                      <th className="font-extrabold text-base-content/50 uppercase">
                        Status
                      </th>
                      <th className="font-extrabold text-base-content/50 uppercase text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300/40">
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-base-200/60 transition-colors cursor-pointer group"
                        onClick={() => setSelectedUser(u)}
                      >
                        {/* User */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-sm group-hover:text-primary transition-colors">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-base-content/40 mt-0.5">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="align-middle">
                          <RoleBadge role={u.role} />
                        </td>

                        {/* Class */}
                        <td className="align-middle hidden sm:table-cell">
                          {u.role === "student" ? (() => {
                            const mods = Array.isArray(u.module) ? u.module : [];
                            const names = mods.map((m) => (typeof m === "object" ? m.title : m)).filter(Boolean);
                            return names.length > 0 ? (
                              <span className="text-xs font-semibold">
                                {names.join(", ")}
                              </span>
                            ) : (
                              <span className="text-base-content/30 italic text-xs">Unassigned</span>
                            );
                          })() : (
                            <span className="text-base-content/30 italic text-xs">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="align-middle">
                          {u.isApproved ? (
                            <span className="badge badge-success badge-soft badge-xs font-bold gap-1">
                              <CheckCircle size={9} /> Active
                            </span>
                          ) : (
                            <span className="badge badge-warning badge-soft badge-xs font-bold gap-1">
                              <ShieldAlert size={9} /> Pending
                            </span>
                          )}
                        </td>

                        {/* Chevron */}
                        <td className="text-right align-middle pr-4">
                          <ChevronRight
                            size={15}
                            className="text-base-content/20 group-hover:text-primary transition-colors ml-auto"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
