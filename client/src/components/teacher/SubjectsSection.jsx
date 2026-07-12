import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import toast from "react-hot-toast";
import { Reorder } from "motion/react";
import {
  ChevronRight,
  Edit3,
  Trash2,
  Save,
  Globe,
  Lock,
  BookOpen,
  X,
  GripVertical,
  ArrowRightLeft,
  Plus,
  Code,
  PenTool,
} from "lucide-react";
import { cmsService } from "../../services/cmsService";
import { Field, inputCls, textareaCls } from "../common/SharedFields";
import { useConfirm } from "../../contexts/ConfirmContext";

const EMPTY_FORM = {
  key: "",
  title: "",
  icon: "BookOpen",
  desc: "",
  color: "",
  iconColor: "text-blue-500",
  path: "",
  moduleId: "",
  isPublic: false,
};

const SubjectsSection = forwardRef(
  ({ selectedModule, subjects, fetchSubjects, isAdmin, modules, onSelectSubject }, ref) => {
    const filteredSubjects = selectedModule
      ? subjects.filter(
          (s) =>
            s.module?._id === selectedModule._id ||
            s.module === selectedModule._id
        )
      : subjects;

    const [form, setForm] = useState({ ...EMPTY_FORM, moduleId: selectedModule?._id || "" });
    const [editingKey, setEditingKey] = useState(null);
    const [saving, setSaving] = useState(false);
    const [togglingKey, setTogglingKey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isReordering, setIsReordering] = useState(false);
    const [localSubjects, setLocalSubjects] = useState(filteredSubjects);
    const [savingReorder, setSavingReorder] = useState(false);
    const confirm = useConfirm();

    useEffect(() => {
      setLocalSubjects(filteredSubjects);
    }, [subjects, selectedModule]); // sync when subjects change

    useEffect(() => {
      setForm((p) => ({
        ...p,
        moduleId: selectedModule?._id || "",
      }));
    }, [selectedModule]);

    const startNew = () => {
      setEditingKey(null);
      setForm({
        ...EMPTY_FORM,
        moduleId: selectedModule?._id || "",
      });
      setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({ startNew }));

    const startEdit = (s) => {
      setEditingKey(s.key);
      setForm({
        ...s,
        moduleId: s.module?._id || s.module || "",
        isPublic: !!s.isPublic,
      });
      setIsModalOpen(true);
    };

    const closeForm = () => {
      setIsModalOpen(false);
      setEditingKey(null);
      setForm({ ...EMPTY_FORM, moduleId: selectedModule?._id || "" });
    };

    const save = async () => {
      setSaving(true);
      try {
        if (editingKey) await cmsService.updateSubject(editingKey, form);
        else await cmsService.createSubject(form);
        await fetchSubjects();
        closeForm();
      } catch (e) {
        toast.error(e.response?.data?.message || e.message);
      } finally {
        setSaving(false);
      }
    };

    const del = async (key) => {
      if (!(await confirm("Delete subject and all its topics?"))) return;
      await cmsService.deleteSubject(key);
      fetchSubjects();
    };

    // Quick-toggle isPublic on the card
    const quickTogglePublic = async (subj, e) => {
      e.stopPropagation();
      setTogglingKey(subj.key);
      try {
        await cmsService.updateSubject(subj.key, { isPublic: !subj.isPublic });
        await fetchSubjects();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setTogglingKey(null);
      }
    };

    const handleSaveReorder = async () => {
      setSavingReorder(true);
      try {
        const orderData = localSubjects.map((s, i) => ({ key: s.key, order: i }));
        await cmsService.reorderSubjects(orderData);
        await fetchSubjects();
        setIsReordering(false);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setSavingReorder(false);
      }
    };

    return (
      <div className="p-4 md:p-6">
        {selectedModule && (
          <div className="flex items-center gap-2 mb-5">
            <span className="badge badge-primary badge-sm font-bold">
              Module: {selectedModule.title}
            </span>
          </div>
        )}

        {filteredSubjects.length === 0 ? (
          <div className="bg-base-200/50 border border-dashed border-base-300 rounded-2xl p-12 text-center text-sm text-base-content/40 flex flex-col items-center gap-2">
            <BookOpen size={32} className="text-base-content/20" />
            <p className="font-bold">
              No subjects{selectedModule ? " in this module" : ""} yet.
            </p>
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
                      setLocalSubjects(filteredSubjects);
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
                    {savingReorder ? <span className="loading loading-spinner loading-xs" /> : <Save size={14} />}
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

            {/* List/Grid */}
            {isReordering ? (
              <Reorder.Group axis="y" values={localSubjects} onReorder={setLocalSubjects} className="flex flex-col gap-3">
                {localSubjects.map((subj) => (
                  <Reorder.Item key={subj.key} value={subj} className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} className="text-base-content/30" />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm truncate">{subj.title}</p>
                      <p className="text-[10px] text-base-content/40 truncate">ID: {subj.key}</p>
                    </div>
                    {subj.isPublic ? (
                      <span className="badge badge-success badge-soft badge-sm font-bold">Public</span>
                    ) : (
                      <span className="badge badge-ghost badge-sm font-bold">Private</span>
                    )}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredSubjects.map((subj) => (
                  <div
                    key={subj.key}
                    className="card bg-base-200/60 border border-base-300/60 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-200 flex flex-col"
                  >
                    {/* Card body — click to drill into topics */}
                    <button
                      className="flex-1 p-5 text-left flex flex-col gap-3 hover:bg-base-200/80 transition-colors"
                      onClick={() => onSelectSubject?.(subj)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-extrabold text-sm">{subj.title}</p>
                          <code className="text-[10px] text-primary/60 font-mono">
                            {subj.key}
                          </code>
                        </div>
                        {/* Quick visibility toggle */}
                        <button
                          onClick={(e) => quickTogglePublic(subj, e)}
                          disabled={togglingKey === subj.key}
                          title={subj.isPublic ? "Make Private" : "Make Public"}
                          className={`shrink-0 badge badge-sm gap-1 font-bold cursor-pointer transition-all ${
                            subj.isPublic
                              ? "badge-success hover:badge-ghost"
                              : "badge-ghost hover:badge-success"
                          }`}
                        >
                          {togglingKey === subj.key ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : subj.isPublic ? (
                            <><Globe size={9} /> Public</>
                          ) : (
                            <><Lock size={9} /> Private</>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-base-content/50 line-clamp-2 leading-relaxed min-h-[32px]">
                        {subj.desc}
                      </p>

                      {subj.teacher && (
                        <p className="text-[10px] text-base-content/40 mt-auto">
                          Teacher:{" "}
                          <span className="font-bold text-base-content/60">
                            {subj.teacher.name}
                          </span>
                        </p>
                      )}
                    </button>

                    {/* Card footer */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-base-300/40 bg-base-200/40 shrink-0">
                      <button
                        onClick={() => onSelectSubject?.(subj)}
                        className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                      >
                        Topics <ChevronRight size={11} />
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(subj)}
                          className="btn btn-xs btn-ghost btn-square rounded-lg"
                          title="Edit subject"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => del(subj.key)}
                          className="btn btn-xs btn-ghost btn-square rounded-lg text-error"
                          title="Delete subject"
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

        {/* ── Modal ───────────────────────────────────────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

              {/* Modal header */}
              <div className="flex justify-between items-center pb-2 border-b border-base-300/40 shrink-0">
                <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
                  <Edit3 size={14} /> {editingKey ? "Edit Subject" : "New Subject"}
                </h3>
                <button onClick={closeForm} className="btn btn-xs btn-circle btn-ghost">
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Key (slug) *">
                  <input
                    className={inputCls}
                    value={form.key}
                    onChange={(e) => setForm((p) => ({ ...p, key: e.target.value.toLowerCase() }))}
                    placeholder="react"
                    disabled={!!editingKey}
                  />
                </Field>
                <Field label="Title *">
                  <input
                    className={inputCls}
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="React Masterclass"
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={form.desc}
                  onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                  placeholder="Short description..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Icon name">
                  <input
                    className={inputCls}
                    value={form.icon}
                    onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                    placeholder="FaReact"
                  />
                </Field>
                <Field label="Icon color">
                  <input
                    className={inputCls}
                    value={form.iconColor}
                    onChange={(e) => setForm((p) => ({ ...p, iconColor: e.target.value }))}
                    placeholder="text-blue-500"
                  />
                </Field>

                {isAdmin && (
                  <div className="col-span-2">
                    <Field label="Module">
                      <select
                        className={inputCls}
                        value={form.moduleId}
                        onChange={(e) => setForm((p) => ({ ...p, moduleId: e.target.value }))}
                      >
                        <option value="">No Module (Standalone)</option>
                        {modules.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                )}
              </div>

              {/* isPublic toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-base-200/60 border border-base-300/40">
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-success"
                  checked={!!form.isPublic}
                  onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">
                    {form.isPublic ? "Public Subject" : "Private Subject"}
                  </p>
                  <p className="text-[10px] text-base-content/50 mt-0.5">
                    {form.isPublic
                      ? "Accessible to all users without module assignment"
                      : "Only visible to students assigned to the module"}
                  </p>
                </div>
                {form.isPublic ? (
                  <Globe size={16} className="text-success shrink-0" />
                ) : (
                  <Lock size={16} className="text-base-content/30 shrink-0" />
                )}
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={closeForm} className="btn btn-sm btn-ghost rounded-xl font-bold flex-1">
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving || !form.key || !form.title}
                  className="btn btn-sm btn-primary rounded-xl font-bold flex-1 flex gap-1.5 items-center justify-center"
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <><Save size={13} /> Save</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default SubjectsSection;
