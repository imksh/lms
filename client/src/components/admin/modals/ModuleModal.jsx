import React from "react";
import { Edit3, Save, X } from "lucide-react";
import { Field, inputCls, textareaCls } from "../../common/SharedFields";
import ToggleSwitch from "../../common/ToggleSwitch";

const ModuleModal = ({
  isOpen,
  onClose,
  moduleForm,
  setModuleForm,
  editingModuleId,
  saveModule,
  saving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl animate-zoomIn">
        <div className="flex justify-between items-center pb-2 border-b border-base-300/40">
          <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
            <Edit3 size={14} />{" "}
            {editingModuleId ? "Edit Module" : "New Module"}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-xs btn-circle btn-ghost font-bold"
          >
            ✕
          </button>
        </div>
        <Field label="Title">
          <input
            className={inputCls}
            value={moduleForm.title}
            onChange={(e) =>
              setModuleForm((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="MERN Stack Bootcamp"
          />
        </Field>
        <Field label="Description">
          <textarea
            className={textareaCls}
            rows={4}
            value={moduleForm.description}
            onChange={(e) =>
              setModuleForm((p) => ({
                ...p,
                description: e.target.value,
              }))
            }
            placeholder="A comprehensive bootcamp covering..."
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Icon (Lucide name)">
            <input
              className={inputCls}
              value={moduleForm.icon}
              onChange={(e) =>
                setModuleForm((p) => ({ ...p, icon: e.target.value }))
              }
              placeholder="BookOpen"
            />
          </Field>
          <Field label="Order">
            <input
              className={inputCls}
              type="number"
              value={moduleForm.order}
              onChange={(e) =>
                setModuleForm((p) => ({ ...p, order: +e.target.value }))
              }
            />
          </Field>
        </div>
        <div className="mt-4 mb-2">
          <ToggleSwitch
            label="Public Module"
            checked={moduleForm.isPublic}
            onChange={(checked) =>
              setModuleForm({
                ...moduleForm,
                isPublic: checked,
              })
            }
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-xl font-bold flex-1"
          >
            Cancel
          </button>
          <button
            onClick={saveModule}
            disabled={saving || !moduleForm.title}
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

export default ModuleModal;
