import React from "react";
import { Reorder } from "motion/react";
import {
  Save,
  ArrowRightLeft,
  GripVertical,
  ChevronRight,
  Trash2,
} from "lucide-react";

const TopicsList = ({
  topics,
  localTopics,
  setLocalTopics,
  isReorderingTopics,
  setIsReorderingTopics,
  savingReorderTopics,
  handleSaveTopicsReorder,
  navigate,
  basePath,
  moduleId,
  subjectKey,
  deleteTopic,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {topics.length === 0 ? (
        <div className="bg-base-200/50 border border-dashed border-base-300 rounded-3xl p-8 text-center text-sm text-base-content/40">
          No topics inside this subject yet. Create your first topic.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {isReorderingTopics ? (
            <Reorder.Group
              axis="y"
              values={localTopics}
              onReorder={setLocalTopics}
              className="flex flex-col gap-3"
            >
              {localTopics.map((t) => (
                <Reorder.Item
                  key={t.topicId}
                  value={t}
                  className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={20} className="text-base-content/30" />
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sm truncate">
                      {t.title}
                    </p>
                    <code className="text-xs text-primary truncate">
                      {t.topicId}
                    </code>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((t) => (
                <div
                  key={t.topicId}
                  className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 hover:border-primary/40  transition-all flex flex-col justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <p className="font-extrabold text-sm truncate">{t.title}</p>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="badge badge-outline text-[10px] py-1 text-base-content border-base-300">
                        {t.difficulty}
                      </span>
                      <span className="badge badge-outline text-[10px] py-1 text-base-content border-base-300">
                        {t.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-base-300/40 pt-3">
                    <button
                      onClick={() =>
                        navigate(
                          `${basePath}/cms/${moduleId}/${subjectKey}/${encodeURIComponent(t.topicId)}`,
                        )
                      }
                      className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                    >
                      Edit Content <ChevronRight size={12} />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteTopic(t._id)}
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

export default TopicsList;
