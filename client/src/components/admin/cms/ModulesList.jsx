import React from "react";
import { Reorder } from "motion/react";
import {
  Save,
  ArrowRightLeft,
  GripVertical,
  Globe,
  Lock,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";

const ModulesList = ({
  modules,
  localModules,
  setLocalModules,
  isReorderingModules,
  setIsReorderingModules,
  savingReorder,
  handleSaveModulesReorder,
  quickTogglePublic,
  togglingId,
  navigate,
  basePath,
  openEditModule,
  deleteModule,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {modules.length === 0 ? (
        <div className="bg-base-200/50 border border-dashed border-base-300 rounded-3xl p-8 text-center text-sm text-base-content/40">
          No modules yet. Create your first module to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {isReorderingModules ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod) => (
                <div
                  key={mod._id}
                  className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 hover:border-primary/40 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        <p className="font-extrabold text-sm truncate">
                          {mod.title}
                        </p>
                      </div>
                      <button
                        onClick={(e) => quickTogglePublic(mod, e)}
                        disabled={togglingId === mod._id}
                        title={mod.isPublic ? "Make Private" : "Make Public"}
                        className={`shrink-0 badge badge-soft badge-sm gap-1 font-bold cursor-pointer transition-all ${
                          mod.isPublic
                            ? "badge-success hover:badge-ghost"
                            : "badge-primary hover:badge-success"
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
                    <p className="text-xs text-base-content/50 mt-2 line-clamp-3 leading-relaxed min-h-[50px]">
                      {mod.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-base-300/40 pt-3">
                    <button
                      onClick={() => navigate(`${basePath}/cms/${mod._id}`)}
                      className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                    >
                      Subjects <ChevronRight size={12} />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModule(mod)}
                        className="btn btn-xs btn-primary btn-square rounded-lg btn-soft"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteModule(mod._id)}
                        className="btn btn-xs btn-error btn-soft btn-square text-error rounded-lg"
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

export default ModulesList;
