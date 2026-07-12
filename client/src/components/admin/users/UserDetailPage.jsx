import React, { useState, useEffect,useCallback } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  ShieldAlert,
  Shield,
  Trash2,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Hash,
  Save,
  Layers,
  FileText,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { userService } from "../../../services/userService";
import { submissionService } from "../../../services/submissionService";
import RoleBadge from "./RoleBadge";
import { useConfirm } from "../../../contexts/ConfirmContext";

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
  const confirm = useConfirm();

  // ── Module selection local state (array of _id strings) ──────────────────
  const getAssignedIds = (u) =>
    Array.isArray(u.module)
      ? u.module.map((m) => (typeof m === "object" ? String(m._id) : String(m)))
      : [];

  const [selectedModuleIds, setSelectedModuleIds] = useState(() =>
    getAssignedIds(initialUser),
  );
  const [isDirty, setIsDirty] = useState(false);

  // ── Submissions state ────────────────────────────────────────────────────
  const [submissions, setSubmissions] = useState([]);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsTotalPages, setSubmissionsTotalPages] = useState(1);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const fetchUserSubmissions = useCallback(async (page = 1) => {
    setLoadingSubmissions(true);
    try {
      const { data } = await submissionService.getAllSubmissions(
        "all",
        page,
        5,
        user._id
      );
      setSubmissions(data.submissions || []);
      setSubmissionsTotalPages(data.pagination?.totalPages || 1);
      setSubmissionsPage(data.pagination?.currentPage || 1);
    } catch (error) {
      console.error("Error fetching user submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id && user.role === "student") {
      fetchUserSubmissions(submissionsPage);
    }
  }, [user._id, submissionsPage, fetchUserSubmissions, user.role]);

  // Track if selection changed from what's saved
  const savedIds = getAssignedIds(user);
  const isDirtyCalc =
    JSON.stringify([...selectedModuleIds].sort()) !==
    JSON.stringify([...savedIds].sort());

  useEffect(() => {
    setIsDirty(isDirtyCalc);
  }, [isDirtyCalc]);

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
      toast.error(e.response?.data?.message || e.message);
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
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = () =>
    run(() => userService.approveUser(user._id, !user.isApproved));

  const toggleRole = async () => {
    const next = user.role === "student" ? "teacher" : "student";
    if (!(await confirm(`Change role to ${next}?`))) return;
    run(() => userService.updateRole(user._id, next));
  };

  const handleDelete = async () => {
    if (!(await confirm(`Permanently delete "${user.name}"? This cannot be undone.`)))
      return;
    setLoading(true);
    try {
      await userService.deleteUser(user._id);
      onRefresh();
      onBack();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
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

      {/* ── NEW: Submissions panel ── */}
      {user.role === "student" && (
        <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h3 className="font-extrabold text-sm">Previous Submissions</h3>
          </div>
          
          {loadingSubmissions ? (
            <div className="py-10 flex justify-center">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-base-content/40 italic">
              No submissions found for this user.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-xs">
                <thead>
                  <tr className="border-b border-base-300/60 bg-base-200/80">
                    <th className="font-extrabold text-base-content/50 uppercase">Topic</th>
                    <th className="font-extrabold text-base-content/50 uppercase">Date</th>
                    <th className="font-extrabold text-base-content/50 uppercase">Type</th>
                    <th className="font-extrabold text-base-content/50 uppercase">Status</th>
                    <th className="font-extrabold text-base-content/50 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/40">
                  {submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-base-200/60 transition-colors">
                      <td className="py-3">
                        <p className="font-bold">
                          {sub.topicDetails?.title || sub.topicId}
                        </p>
                        <p className="text-[10px] text-base-content/50 mt-0.5">
                          Section {sub.sectionIndex + 1}
                        </p>
                      </td>
                      <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-ghost badge-sm capitalize font-semibold">
                          {sub.submissionType}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-sm font-bold capitalize ${
                          sub.status === "graded" ? "badge-success badge-soft" : "badge-warning badge-soft"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        {sub.grade !== null ? (
                          <span className="font-black text-primary">{sub.grade}/100</span>
                        ) : (
                          <span className="text-base-content/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {submissionsTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 border-t border-base-300/40 pt-4">
                  <span className="text-xs font-bold text-base-content/50">
                    Page {submissionsPage} of {submissionsTotalPages}
                  </span>
                  <div className="join">
                    <button
                      className="join-item btn btn-xs btn-outline"
                      disabled={submissionsPage === 1}
                      onClick={() => setSubmissionsPage(p => p - 1)}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      className="join-item btn btn-xs btn-outline"
                      disabled={submissionsPage === submissionsTotalPages}
                      onClick={() => setSubmissionsPage(p => p + 1)}
                    >
                      <ChevronRightIcon size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
