import React from "react";
import { Reorder } from "motion/react";
import {
  Save,
  ArrowRightLeft,
  GripVertical,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";

const SubjectsList = ({
  moduleId,
  subjects,
  localSubjects,
  setLocalSubjects,
  isReorderingSubjects,
  setIsReorderingSubjects,
  savingReorderSubjects,
  handleSaveSubjectsReorder,
  navigate,
  basePath,
  openEditSubject,
  deleteSubject,
}) => {
  const moduleSubjects = subjects.filter(
    (s) => s.module?._id === moduleId || s.module === moduleId,
  );

  return (
    <div className="flex flex-col gap-6">
      {moduleSubjects.length === 0 ? (
        <div className="bg-base-200/50 border border-dashed border-base-300 rounded-3xl p-8 text-center text-sm text-base-content/40">
          No subjects inside this module yet. Create your first subject.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {isReorderingSubjects ? (
            <Reorder.Group
              axis="y"
              values={localSubjects}
              onReorder={setLocalSubjects}
              className="flex flex-col gap-3"
            >
              {localSubjects.map((sub) => (
                <Reorder.Item
                  key={sub.key}
                  value={sub}
                  className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={20} className="text-base-content/30" />
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sm truncate">
                      {sub.title}
                    </p>
                    <code className="text-xs text-primary truncate">
                      {sub.key}
                    </code>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moduleSubjects.map((sub) => (
                <div
                  key={sub.key}
                  className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 hover:border-primary/40  transition-all flex flex-col justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📖</span>
                        <p className="font-extrabold text-sm truncate">
                          {sub.title}
                        </p>
                      </div>
                      <code className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-md font-mono">
                        {sub.key}
                      </code>
                    </div>
                    <p className="text-xs text-base-content/50 mt-2 line-clamp-3 leading-relaxed min-h-[50px]">
                      {sub.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-base-300/40 pt-3">
                    <button
                      onClick={() => navigate(`${basePath}/cms/${moduleId}/${sub.key}`)}
                      className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                    >
                      Topics <ChevronRight size={12} />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditSubject(sub)}
                        className="btn btn-xs btn-primary btn-soft btn-square rounded-lg"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteSubject(sub.key)}
                        className="btn btn-xs btn-error btn-square text-error rounded-lg btn-soft"
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
    </div>
  );
};

export default SubjectsList;
