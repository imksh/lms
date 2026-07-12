import React from "react";
import { Edit3, Save, X } from "lucide-react";
import { Field, inputCls, textareaCls } from "../../common/SharedFields";
import ToggleSwitch from "../../common/ToggleSwitch";

const SubjectModal = ({
  isOpen,
  onClose,
  subjectForm,
  setSubjectForm,
  editingSubjectKey,
  saveSubject,
  saving,
  modules,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl animate-zoomIn">
        <div className="flex justify-between items-center pb-2 border-b border-base-300/40">
          <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
            <Edit3 size={14} />{" "}
            {editingSubjectKey ? "Edit Subject" : "New Subject"}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-xs btn-circle btn-ghost font-bold"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Key (slug)">
            <input
              className={inputCls}
              value={subjectForm.key}
              onChange={(e) =>
                setSubjectForm((p) => ({ ...p, key: e.target.value }))
              }
              placeholder="react"
              disabled={!!editingSubjectKey}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputCls}
              value={subjectForm.title}
              onChange={(e) =>
                setSubjectForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="React Masterclass"
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            className={textareaCls}
            rows={3}
            value={subjectForm.desc}
            onChange={(e) =>
              setSubjectForm((p) => ({ ...p, desc: e.target.value }))
            }
            placeholder="Short description..."
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Icon name">
            <input
              className={inputCls}
              value={subjectForm.icon}
              onChange={(e) =>
                setSubjectForm((p) => ({ ...p, icon: e.target.value }))
              }
              placeholder="FaReact"
            />
          </Field>
          <Field label="Icon color class">
            <input
              className={inputCls}
              value={subjectForm.iconColor}
              onChange={(e) =>
                setSubjectForm((p) => ({
                  ...p,
                  iconColor: e.target.value,
                }))
              }
              placeholder="text-blue-500"
            />
          </Field>
        </div>
        {modules.length > 0 && (
          <Field label="Module">
            <select
              className="select select-sm select-bordered bg-base-100 rounded-xl text-sm w-full"
              value={subjectForm.moduleId}
              onChange={(e) =>
                setSubjectForm((p) => ({
                  ...p,
                  moduleId: e.target.value,
                }))
              }
            >
              <option value="">— Unassigned —</option>
              {modules.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </Field>
        )}
        
        <div className="mt-4 mb-2">
          <ToggleSwitch
            label="Public Subject"
            checked={subjectForm.isPublic || false}
            onChange={(checked) =>
              setSubjectForm((p) => ({
                ...p,
                isPublic: checked,
              }))
            }
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-xl font-bold flex-1"
          >
            Cancel
          </button>
          <button
            onClick={saveSubject}
            disabled={saving || !subjectForm.key || !subjectForm.title}
            className="btn btn-sm btn-primary rounded-xl font-bold flex-1 flex gap-1 items-center justify-center"
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
  );
};

export default SubjectModal;
