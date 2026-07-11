import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Reorder } from "motion/react";
import {
  Trash2,
  Edit3,
  Save,
  ChevronRight,
  Globe,
  Lock,
  BookOpen,
  X,
  GripVertical,
  ArrowRightLeft,
} from "lucide-react";
import { cmsService } from "../../services/cmsService";
import { Field, inputCls, textareaCls } from "../common/SharedFields";

const EMPTY_FORM = {
  title: "",
  description: "",
  icon: "BookOpen",
  color: "",
  iconColor: "text-primary",
  path: "",
  isPublic: false,
  isPublic: false,
};

const ModulesSection = forwardRef(
  ({ modules, fetchModules, onSelectModule }, ref) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [togglingId, setTogglingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isReordering, setIsReordering] = useState(false);
    const [localModules, setLocalModules] = useState(modules);
    const [savingReorder, setSavingReorder] = useState(false);

    useEffect(() => {
      setLocalModules(modules);
    }, [modules]);

    const startNew = () => {
      setEditingId(null);
      setForm(EMPTY_FORM);
      setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({ startNew }));

    const startEdit = (mod) => {
      setEditingId(mod._id);
      setForm({
        title: mod.title,
        description: mod.description || "",
        icon: mod.icon || "BookOpen",
        color: mod.color || "",
        iconColor: mod.iconColor || "text-primary",
        path: mod.path || "",
        isPublic: !!mod.isPublic,
        isPublic: !!mod.isPublic,
      });
      setIsModalOpen(true);
    };

    const closeForm = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    };

    const save = async () => {
      setSaving(true);
      try {
        if (editingId) await cmsService.updateModule(editingId, form);
        else await cmsService.createModule(form);
        await fetchModules();
        closeForm();
      } catch (e) {
        alert(e.response?.data?.message || e.message);
      } finally {
        setSaving(false);
      }
    };

    const del = async (id) => {
      if (!confirm("Delete this module? Subjects will be detached.")) return;
      await cmsService.deleteModule(id);
      fetchModules();
    };

    // Quick-toggle isPublic without opening the modal
    const quickTogglePublic = async (mod, e) => {
      e.stopPropagation();
      setTogglingId(mod._id);
      try {
        await cmsService.updateModule(mod._id, { isPublic: !mod.isPublic });
        await fetchModules();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      } finally {
        setTogglingId(null);
      }
    };

    const handleSaveReorder = async () => {
      setSavingReorder(true);
      try {
        const orderData = localModules.map((m, i) => ({ id: m._id, order: i }));
        await cmsService.reorderModules(orderData);
        await fetchModules();
        setIsReordering(false);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      } finally {
        setSavingReorder(false);
      }
    };

    return (
      <div className="p-4 md:p-6">
        {modules.length === 0 ? (
          <div className="bg-base-200/50 border border-dashed border-base-300 rounded-2xl p-12 text-center text-sm text-base-content/40 flex flex-col items-center gap-2">
            <BookOpen size={32} className="text-base-content/20" />
            <p className="font-bold">No modules yet.</p>
            <p className="text-xs">Create your first module to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Reorder Header */}
            <div className="flex justify-end mb-2">
              {isReordering ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsReordering(false);
                      setLocalModules(modules);
                    }}
                    className="btn btn-sm btn-ghost"
                    disabled={savingReorder}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReorder}
                    className="btn btn-sm btn-primary flex gap-2 items-center"
                    disabled={savingReorder}
                  >
                    {savingReorder ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save Order
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsReordering(true)}
                  className="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:border-base-300 flex gap-2 items-center rounded-xl"
                >
                  <ArrowRightLeft size={14} className="rotate-90" />
                  Reorder
                </button>
              )}
            </div>

            {/* Module List/Grid */}
            {isReordering ? (
              <Reorder.Group
                axis="y"
                values={localModules}
                onReorder={setLocalModules}
                className="flex flex-col gap-3"
              >
                {localModules.map((mod) => (
                  <Reorder.Item
                    key={mod._id}
                    value={mod}
                    className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={20} className="text-base-content/30" />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm truncate">
                        {mod.title}
                      </p>
                      <p className="text-xs text-base-content/50 truncate">
                        {mod.subjects?.length ?? 0} subjects
                      </p>
                    </div>
                    {mod.isPublic ? (
                      <span className="badge badge-success badge-soft badge-sm font-bold">
                        Public
                      </span>
                    ) : (
                      <span className="badge badge-ghost badge-sm font-bold">
                        Private
                      </span>
                    )}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {modules.map((mod) => (
                  <div
                    key={mod._id}
                    className="card bg-base-200/60 border border-base-300/60 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-200 flex flex-col"
                  >
                    {/* Card header — click to drill into subjects */}
                    <button
                      className="flex-1 p-5 text-left flex flex-col gap-3 hover:bg-base-200/80 transition-colors"
                      onClick={() => onSelectModule?.(mod)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-extrabold text-sm leading-snug">
                          {mod.title}
                        </p>
                        {/* Visibility quick-toggle */}
                        <button
                          onClick={(e) => quickTogglePublic(mod, e)}
                          disabled={togglingId === mod._id}
                          title={mod.isPublic ? "Make Private" : "Make Public"}
                          className={`shrink-0 badge badge-sm gap-1 font-bold cursor-pointer transition-all ${
                            mod.isPublic
                              ? "badge-success hover:badge-ghost"
                              : "badge-ghost hover:badge-success"
                          }`}
                        >
                          {togglingId === mod._id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : mod.isPublic ? (
                            <>
                              <Globe size={9} /> Public
                            </>
                          ) : (
                            <>
                              <Lock size={9} /> Private
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-base-content/50 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap mt-auto">
                        <span className="badge badge-xs badge-outline font-semibold">
                          {mod.subjects?.length ?? 0} subject
                          {mod.subjects?.length !== 1 ? "s" : ""}
                        </span>
                        {mod.path && (
                          <code className="text-[10px] text-base-content/40 font-mono bg-base-300/50 px-1.5 py-0.5 rounded">
                            /{mod.path.replace(/^\//, "")}
                          </code>
                        )}
                      </div>
                    </button>

                    {/* Card footer */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-base-300/40 bg-base-200/40 shrink-0">
                      <button
                        onClick={() => onSelectModule?.(mod)}
                        className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                      >
                        Subjects <ChevronRight size={11} />
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(mod)}
                          className="btn btn-xs btn-ghost btn-square rounded-lg"
                          title="Edit module"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => del(mod._id)}
                          className="btn btn-xs btn-ghost btn-square rounded-lg text-error"
                          title="Delete module"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Modal ─────────────────────────────────────────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex justify-between items-center pb-2 border-b border-base-300/40 shrink-0">
                <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
                  <Edit3 size={14} /> {editingId ? "Edit Module" : "New Module"}
                </h3>
                <button
                  onClick={closeForm}
                  className="btn btn-xs btn-circle btn-ghost"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Fields */}
              <Field label="Title *">
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="MERN Stack Bootcamp"
                />
              </Field>

              <Field label="Description *">
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="A comprehensive bootcamp covering..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Icon (Lucide name)">
                  <input
                    className={inputCls}
                    value={form.icon}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, icon: e.target.value }))
                    }
                    placeholder="BookOpen"
                  />
                </Field>
                <Field label="Path / Slug">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 text-xs">
                      /
                    </span>
                    <input
                      className={`${inputCls} pl-6`}
                      value={form.path.replace(/^\//, "")}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, path: e.target.value }))
                      }
                      placeholder="mern"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Icon color class">
                <input
                  className={inputCls}
                  value={form.iconColor}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, iconColor: e.target.value }))
                  }
                  placeholder="text-primary"
                />
              </Field>

              {/* isPublic toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-base-200/60 border border-base-300/40">
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-success"
                  checked={form.isPublic}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isPublic: e.target.checked }))
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">
                    {form.isPublic ? "Public Module" : "Private Module"}
                  </p>
                  <p className="text-[10px] text-base-content/50 mt-0.5">
                    {form.isPublic
                      ? "All users can access this module without assignment"
                      : "Only assigned students can access this module"}
                  </p>
                </div>
                {form.isPublic ? (
                  <Globe size={16} className="text-success shrink-0" />
                ) : (
                  <Lock size={16} className="text-base-content/30 shrink-0" />
                )}
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeForm}
                  className="btn btn-sm btn-ghost rounded-xl font-bold flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving || !form.title || !form.description}
                  className="btn btn-sm btn-primary rounded-xl font-bold flex-1 flex gap-1.5 items-center justify-center"
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <>
                      <Save size={13} /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default ModulesSection;
