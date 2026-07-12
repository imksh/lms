import React from "react";
import { Edit3, Save } from "lucide-react";
import { Field, inputCls } from "../../common/SharedFields";

const TopicModal = ({
  isOpen,
  onClose,
  topicInitialForm,
  setTopicInitialForm,
  handleCreateTopic,
  saving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl animate-zoomIn">
        <div className="flex justify-between items-center pb-2 border-b border-base-300/40">
          <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
            <Edit3 size={14} /> New Topic
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
            value={topicInitialForm.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setTopicInitialForm((p) => {
                const updates = { title: newTitle };
                // Auto slugify topicId if it hasn't been heavily manually edited
                updates.topicId = newTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                return { ...p, ...updates };
              });
            }}
            placeholder="Introduction to React"
          />
        </Field>

        <Field label="Topic ID (path)">
          <input
            className={inputCls}
            value={topicInitialForm.topicId}
            onChange={(e) =>
              setTopicInitialForm((p) => ({ ...p, topicId: e.target.value }))
            }
            placeholder="introduction-to-react"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Difficulty">
            <select
              className="select select-sm select-bordered bg-base-100 rounded-xl text-sm w-full"
              value={topicInitialForm.difficulty}
              onChange={(e) =>
                setTopicInitialForm((p) => ({ ...p, difficulty: e.target.value }))
              }
            >
              {["Beginner", "Intermediate", "Advanced"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Duration">
            <input
              className={inputCls}
              value={topicInitialForm.duration}
              onChange={(e) =>
                setTopicInitialForm((p) => ({ ...p, duration: e.target.value }))
              }
              placeholder="10 mins"
            />
          </Field>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-xl font-bold flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTopic}
            disabled={saving || !topicInitialForm.title || !topicInitialForm.topicId}
            className="btn btn-sm btn-primary rounded-xl font-bold flex-1 flex gap-1 items-center justify-center"
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <>
                <Save size={13} /> Create Topic
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicModal;
