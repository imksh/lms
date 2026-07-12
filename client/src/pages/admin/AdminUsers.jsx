import React, { useState, useEffect, useCallback } from "react";
import { Users, CheckCircle, ShieldAlert, ChevronRight } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { userService } from "../../services/userService";
import { cmsService } from "../../services/cmsService";
import useWindowSize from "../../hooks/useWindowSize";

import RoleBadge from "../../components/admin/users/RoleBadge";
import UserDetailPage from "../../components/admin/users/UserDetailPage";
import Loading from "../../components/Loading";

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
        <div className="px-2 py-6 md:p-6 flex flex-col gap-6">
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
                  className="select select-sm select-bordered rounded-xl bg-base-200 font-bold text-xs w-fit ml-auto md:ml-0 sm:w-44"
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
            <div className="flex justify-center items-center py-24 relative min-h-[50dvh]">
              <Loading />
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
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block card bg-base-200/40 border border-base-300/60 rounded-3xl overflow-hidden shadow-xs">
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
                        <th className="font-extrabold text-base-content/50 uppercase">
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
                          <td className="align-middle">
                            {u.role === "student" ? (
                              (() => {
                                const mods = Array.isArray(u.module)
                                  ? u.module
                                  : [];
                                const names = mods
                                  .map((m) =>
                                    typeof m === "object" ? m.title : m,
                                  )
                                  .filter(Boolean);
                                return names.length > 0 ? (
                                  <span className="text-xs font-semibold">
                                    {names.join(", ")}
                                  </span>
                                ) : (
                                  <span className="text-base-content/30 italic text-xs">
                                    Unassigned
                                  </span>
                                );
                              })()
                            ) : (
                              <span className="text-base-content/30 italic text-xs">
                                —
                              </span>
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

              {/* Mobile Card View */}
              <div className="flex flex-col gap-3 md:hidden">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="card bg-base-100 border border-base-300 shadow-sm p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm">{u.name}</p>
                          <p className="text-xs text-base-content/50">
                            {u.email}
                          </p>
                        </div>
                      </div>
                      <RoleBadge role={u.role} />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-base-content/60 flex items-center gap-1.5">
                        <span className="font-bold opacity-60">CLASS:</span>
                        {u.role === "student" ? (
                          (() => {
                            const mods = Array.isArray(u.module)
                              ? u.module
                              : [];
                            const names = mods
                              .map((m) => (typeof m === "object" ? m.title : m))
                              .filter(Boolean);
                            return names.length > 0 ? (
                              <span className="font-semibold text-base-content">
                                {names.join(", ")}
                              </span>
                            ) : (
                              <span className="italic">Unassigned</span>
                            );
                          })()
                        ) : (
                          <span className="italic">—</span>
                        )}
                      </div>

                      {u.isApproved ? (
                        <span className="badge badge-success badge-soft badge-xs font-bold gap-1">
                          <CheckCircle size={9} /> Active
                        </span>
                      ) : (
                        <span className="badge badge-warning badge-soft badge-xs font-bold gap-1">
                          <ShieldAlert size={9} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
