import React, { useState, useEffect } from "react";
import {
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Sandbox from "./Sandbox";

const LearnTab = ({
  activeTopic,
  mySubmissions = [],
  handleTaskSubmit,
  theme,
}) => {
  // State to hold the current draft input for each section index task
  const [taskDrafts, setTaskDrafts] = useState({});
  const [expandedSubmissions, setExpandedSubmissions] = useState({});

  // Reset drafts when activeTopic changes
  useEffect(() => {
    setTaskDrafts({});
    setExpandedSubmissions({});
  }, [activeTopic]);

  const handleDraftChange = (index, value) => {
    setTaskDrafts((prev) => ({ ...prev, [index]: value }));
  };

  const toggleExpand = (index) => {
    setExpandedSubmissions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Render fallbacks if sections is empty (backward compatibility)
  if (!activeTopic.sections || activeTopic.sections.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn">
        {/* Explanation */}
        <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>💡</span> Explanation
          </h3>
          <p className="text-base-content/85 leading-relaxed text-base">
            {activeTopic.introduction}
          </p>
        </div>

        {/* Analogy */}
        {activeTopic.analogy && (
          <div className="card bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/25 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <span>🎭</span> Real-World Analogy
            </h3>
            <p className="text-base-content/85 leading-relaxed italic text-base">
              {activeTopic.analogy}
            </p>
          </div>
        )}

        {/* Why Use It */}
        {activeTopic.whyUse && activeTopic.whyUse.length > 0 && (
          <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🔥</span> Key Advantages & Use Cases
            </h3>
            <ul className="space-y-3">
              {activeTopic.whyUse.map((reason, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-success font-bold">✔</span>
                  <span className="text-base-content/80">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Syntax Code Blueprint */}
        {activeTopic.syntax && (
          <div className="card bg-neutral text-neutral-content rounded-3xl p-6 shadow-inner font-mono relative overflow-hidden">
            <div className="absolute top-3 right-4 text-xs font-black text-neutral-content/40 tracking-wider">
              BLUEPRINT
            </div>
            <h3 className="text-base font-bold mb-4 text-primary text-opacity-90">
              Code Example
            </h3>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
              <code>{activeTopic.syntax}</code>
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {activeTopic.sections.map((section, idx) => {
        // Find existing submission for this section
        const submission = mySubmissions.find(
          (sub) =>
            sub.topicId === activeTopic.topicId && sub.sectionIndex === idx,
        );

        const draft = taskDrafts[idx] ?? (submission?.submittedContent || "");

        return (
          <div key={idx} className="flex flex-col gap-4">
            {/* Section Card */}
            <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
              {section.title && (
                <h3 className="text-lg font-black text-primary flex items-center gap-2 border-b border-base-300/40 pb-2.5 mb-1">
                  <span>💡</span> {section.title}
                </h3>
              )}
              <div
                className="text-base-content/85 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>

            {/* Section Task Form (if task exists) */}
            {section.task && (
              <div className="card bg-gradient-to-br from-primary/5 via-base-200 to-accent/5 border border-primary/20 rounded-3xl p-6 shadow-md flex flex-col gap-4 ml-0 md:ml-6">
                <div className="flex justify-between items-center border-b border-base-300/65 pb-3 gap-2">
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="text-[10px] font-black tracking-wider text-primary uppercase">
                      Practice Task Challenge
                    </span>
                    <h4 className="text-base font-extrabold text-base-content truncate">
                      {section.task.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge badge-accent badge-sm font-black py-2.5">
                      {section.task.points} pts
                    </span>
                    {submission ? (
                      submission.status === "approved" ? (
                        <span className="badge badge-success text-[10px] font-bold py-2.5 flex gap-1 items-center">
                          <CheckCircle size={10} /> Evaluated:{" "}
                          {submission.grade}/{section.task.points}
                        </span>
                      ) : submission.status === "rejected" ? (
                        <span className="badge badge-error text-[10px] font-bold py-2.5 flex gap-1 items-center">
                          <AlertTriangle size={10} /> Rejected
                        </span>
                      ) : (
                        <span className="badge badge-warning text-[10px] font-bold py-2.5 flex gap-1 items-center">
                          <Clock size={10} /> Pending
                        </span>
                      )
                    ) : (
                      <span className="badge badge-neutral text-[10px] font-bold py-2.5">
                        Not Submitted
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-base-content/75 leading-relaxed bg-base-100 p-3.5 border border-base-300 rounded-2xl">
                  <span className="font-bold block text-base-content mb-1 text-[11px] uppercase tracking-wider text-base-content/60">
                    Instructions:
                  </span>
                  {section.task.text}
                </div>

                {/* Submit Form inputs based on type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-base-content/50">
                    Your Response (
                    {section.task.submissionType === "playground"
                      ? "Source Code Editor"
                      : section.task.submissionType === "file"
                        ? "File link / Image attachment"
                        : "Written Essay Answer"}
                    )
                  </label>

                  {section.task.submissionType === "playground" && <Sandbox />}

                  {section.task.submissionType === "text" && (
                    <textarea
                      rows={5}
                      className="textarea textarea-bordered w-full rounded-2xl text-xs p-4 bg-base-100 focus:textarea-primary leading-relaxed"
                      placeholder="Write your detailed summary or solution paragraph here..."
                      value={draft}
                      onChange={(e) => handleDraftChange(idx, e.target.value)}
                    />
                  )}

                  {section.task.submissionType === "file" && (
                    <input
                      type="text"
                      className="input input-bordered w-full rounded-xl bg-base-100 text-xs focus:border-primary"
                      placeholder="https://example.com/your-submission-document.pdf"
                      value={draft}
                      onChange={(e) => handleDraftChange(idx, e.target.value)}
                    />
                  )}
                </div>

                {/* Submit Action */}
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {submission && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(idx)}
                        className="btn btn-xs btn-ghost text-[10px] font-bold flex gap-1 items-center"
                      >
                        {expandedSubmissions[idx] ? (
                          <>
                            Hide Submitted <ChevronUp size={12} />
                          </>
                        ) : (
                          <>
                            Show Submitted <ChevronDown size={12} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!draft.trim())
                        return alert(
                          "Please fill in your response before submitting.",
                        );
                      await handleTaskSubmit(
                        idx,
                        section.task.submissionType,
                        draft,
                      );
                    }}
                    className="btn btn-sm btn-primary rounded-xl px-5 font-bold flex gap-1.5 items-center shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Send size={14} />{" "}
                    {submission ? "Update Submission" : "Submit Answer"}
                  </button>
                </div>

                {/* Expand previous submission details */}
                {submission && expandedSubmissions[idx] && (
                  <div className="mt-3 p-4 bg-base-100 rounded-2xl border border-base-300 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-base-content/65 border-b border-base-300 pb-1.5">
                      <span>YOUR SUBMITTED CONTENT:</span>
                      <span>
                        Submitted on:{" "}
                        {new Date(submission.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <pre className="text-xs font-mono bg-base-200 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {submission.submittedContent}
                    </pre>
                    {submission.feedback && (
                      <div className="p-3 bg-info/10 border border-info/20 rounded-xl text-xs text-info leading-relaxed">
                        <span className="font-bold block text-info/90 mb-0.5">
                          Instructor Feedback:
                        </span>
                        {submission.feedback}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearnTab;
