import React, { useState } from "react";
import { RichTextEditor } from "@imksh/editor";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  FilePlus,
  CheckCircle,
  Plus,
  Maximize,
  Minimize,
} from "lucide-react";
import { Field, inputCls, textareaCls } from "../../common/SharedFields";
import ToggleSwitch from "../../common/ToggleSwitch";

const TopicEditor = ({
  topicForm,
  setTopicForm,
  activeTab,
  setActiveTab,
  newQuiz,
  setNewQuiz,
  topicId,
}) => {
  const tf = topicForm;
  const [toggleDetails, setToggleDetails] = useState(false);

  // Topic sections helpers
  const mutSec = (fn) =>
    setTopicForm((p) => {
      const secs = [...p.sections];
      fn(secs);
      return { ...p, sections: secs };
    });
  const addSec = () =>
    mutSec((s) =>
      s.push({
        title: ``,
        content: "<p>Content here...</p>",
        task: null,
      }),
    );
  const removeSec = (i) => mutSec((s) => s.splice(i, 1));
  const moveSec = (i, dir) =>
    mutSec((s) => {
      const ti = i + (dir === "up" ? -1 : 1);
      if (ti < 0 || ti >= s.length) return;
      [s[i], s[ti]] = [s[ti], s[i]];
    });
  const setSec = (i, field, val) =>
    mutSec((s) => {
      s[i] = { ...s[i], [field]: val };
    });
  const toggleTask = (i) =>
    mutSec((s) => {
      s[i] = {
        ...s[i],
        task: s[i].task
          ? null
          : {
              title: "Challenge",
              text: "Implement the concept.",
              points: 10,
              submissionType: "text",
              defaultCode: "// Write your code here\n",
              language: "javascript",
            },
      };
    });
  const setTask = (i, field, val) =>
    mutSec((s) => {
      s[i] = {
        ...s[i],
        task: { ...s[i].task, [field]: val },
      };
    });

  const addQuiz = () => {
    if (!newQuiz.question.trim()) {
      console.log("Quiz question empty");
      return;
    }
    const validOptions = newQuiz.options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      console.log("Not enough valid options");
      return;
    }

    const finalIndex = Math.min(
      newQuiz.correctAnswerIndex,
      validOptions.length - 1,
    );

    console.log("Adding quiz:", {
      ...newQuiz,
      options: validOptions,
      correctAnswerIndex: finalIndex,
    });
    setTopicForm((p) => {
      const updated = {
        ...p,
        quiz: [
          ...(p.quiz || []),
          { ...newQuiz, options: validOptions, correctAnswerIndex: finalIndex },
        ],
      };
      console.log("New topicForm quiz length:", updated.quiz.length);
      return updated;
    });
    setNewQuiz({
      question: "",
      options: ["", ""],
      correctAnswerIndex: 0,
    });
  };

  const removeQuiz = (i) =>
    setTopicForm((p) => {
      const qz = [...(p.quiz || [])];
      qz.splice(i, 1);
      return { ...p, quiz: qz };
    });

  return (
    <div className="flex flex-col gap-6 md:overflow-hidden md:h-[calc(100vh-110px)]">
      {/* Form configuration */}
      <div className={`grid grid-cols-1 ${toggleDetails ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6 md:overflow-hidden h-full`}>
        <div className={`${toggleDetails ? "lg:col-span-1" : "lg:col-span-2"} flex flex-col gap-6 md:overflow-y-auto h-full pb-10 pr-2`}>
          <div className="sticky top-0 z-20 w-full bg-base-100 m-1 flex justify-between items-center">
            <div className="tabs tabs-box bg-base-200 p-1 rounded-2xl w-fit flex gap-1 ">
              {["sections", "quiz", "playground"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`tab tab-sm font-bold rounded-xl capitalize ${activeTab === t ? "tab-active bg-primary text-primary-content!" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setToggleDetails(!toggleDetails)}
              className="btn btn-sm btn-primary btn-soft border border-base-300 rounded-xl flex items-center gap-2"
              title={toggleDetails ? "Show Details" : "Full Screen Form"}
            >
              {toggleDetails ? <Minimize size={16} /> : <Maximize size={16} />}
              <span className="hidden md:inline font-bold">{toggleDetails ? "Show Details" : "Full Screen"}</span>
            </button>
          </div>

          {/* Sections */}
          {activeTab === "sections" && (
            <div className="flex flex-col gap-4">
              {tf.sections?.map((sec, i) => (
                <div
                  key={i}
                  className="md:card border-b md:bg-base-200/50 md:border border-base-300/60 md:rounded-2xl px-2 py-4 border-0 md:p-5 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-neutral badge-sm font-black">
                        #{i + 1}
                      </span>
                      <input
                        className="input input-xs bg-transparent border-none font-bold text-sm focus:outline-none md:w-48 shrink"
                        value={sec.title}
                        onChange={(e) => setSec(i, "title", e.target.value)}
                        placeholder="Section title..."
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSec(i, "up")}
                        disabled={i === 0}
                        className="btn btn-xs btn-ghost rounded-lg opacity-50 hover:opacity-100"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSec(i, "down")}
                        disabled={i === tf.sections.length - 1}
                        className="btn btn-xs btn-ghost rounded-lg opacity-50 hover:opacity-100"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSec(i)}
                        className="btn btn-xs btn-error btn-soft rounded-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-base-300">
                    <RichTextEditor
                      value={sec.content}
                      onChange={(val) => setSec(i, "content", val)}
                      height={300}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTask(i)}
                      className={`btn btn-xs rounded-xl font-bold ${sec.task ? "btn-warning btn-soft" : "btn-primary btn-soft border border-base-300"}`}
                    >
                      {sec.task ? "Remove Task" : "+ Add Task"}
                    </button>
                  </div>
                  {sec.task && (
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex flex-col gap-3">
                      <p className="text-[11px] font-black text-primary uppercase tracking-wider">
                        Task Configuration
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Field label="Task Title">
                          <input
                            className={inputCls}
                            value={sec.task.title}
                            onChange={(e) =>
                              setTask(i, "title", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Points">
                          <input
                            className={inputCls}
                            type="number"
                            value={sec.task.points}
                            onChange={(e) =>
                              setTask(i, "points", +e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Submission Type">
                          <select
                            className="select select-sm select-bordered bg-base-100 rounded-xl text-sm w-full"
                            value={sec.task.submissionType}
                            onChange={(e) =>
                              setTask(i, "submissionType", e.target.value)
                            }
                          >
                            {["text", "playground", "file"].map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Instructions">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={sec.task.text}
                          onChange={(e) => setTask(i, "text", e.target.value)}
                        />
                      </Field>
                      {sec.task.submissionType === "playground" && (
                        <>
                          <Field label="Language">
                            <select
                              className={inputCls}
                              value={sec.task.language || "javascript"}
                              onChange={(e) =>
                                setTask(i, "language", e.target.value)
                              }
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="browser">Browser Env</option>
                              <option value="python">Python</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                              <option value="java">Java</option>
                              <option value="cpp">C++</option>
                            </select>
                          </Field>
                          <Field label="Default Code">
                            <textarea
                              className="font-mono text-xs bg-neutral text-neutral-content p-4 rounded-2xl min-h-32 w-full resize-y focus:outline-none focus:ring-1 focus:ring-primary border border-neutral-content/10"
                              rows={4}
                              value={sec.task.defaultCode || ""}
                              onChange={(e) =>
                                setTask(i, "defaultCode", e.target.value)
                              }
                            />
                          </Field>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSec}
                className="btn btn-sm btn-primary btn-soft rounded-2xl border border-dashed border-base-300 font-bold flex gap-1 items-center hover:border-primary/50 hover:text-primary py-4"
              >
                <FilePlus size={14} /> Add Section
              </button>
            </div>
          )}

          {/* Quiz */}
          {activeTab === "quiz" && (
            <div className="flex flex-col gap-4">
              {tf.quiz?.map((q, i) => (
                <div
                  key={i}
                  className="card bg-base-200/50 border border-base-300/60 rounded-2xl p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="badge badge-primary badge-sm font-black">
                      Q{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuiz(i)}
                      className="btn btn-xs btn-error btn-soft rounded-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold">{q.question}</p>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`text-xs px-3 py-1.5 rounded-xl border ${oi === q.correctAnswerIndex ? "bg-success/15 border-success/30 text-success font-bold" : "bg-base-100 border-base-300 text-base-content/60"}`}
                      >
                        {oi === q.correctAnswerIndex && (
                          <CheckCircle size={10} className="inline mr-1" />
                        )}
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-3">
                <p className="text-xs font-black text-base-content/50 uppercase tracking-wider">
                  Add Question
                </p>
                <Field label="Question">
                  <input
                    className={inputCls}
                    value={newQuiz.question}
                    onChange={(e) =>
                      setNewQuiz((p) => ({ ...p, question: e.target.value }))
                    }
                    placeholder="What does JSX stand for?"
                  />
                </Field>
                <div className="flex flex-col gap-2 mt-1">
                  {newQuiz.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={newQuiz.correctAnswerIndex === i}
                        onChange={() =>
                          setNewQuiz((p) => ({ ...p, correctAnswerIndex: i }))
                        }
                        className="radio radio-success radio-xs shrink-0"
                      />
                      <input
                        className={inputCls}
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewQuiz((p) => {
                            const opts = [...p.options];
                            opts[i] = val;
                            return { ...p, options: opts };
                          });
                        }}
                        placeholder={`Option ${i + 1}`}
                      />
                      {newQuiz.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewQuiz((p) => {
                              const opts = [...p.options];
                              opts.splice(i, 1);
                              let newIndex = p.correctAnswerIndex;
                              if (newIndex === i) newIndex = 0;
                              else if (newIndex > i) newIndex -= 1;
                              return {
                                ...p,
                                options: opts,
                                correctAnswerIndex: newIndex,
                              };
                            });
                          }}
                          className="btn btn-xs btn-soft btn-error btn-square rounded-lg shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {newQuiz.options.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setNewQuiz((p) => ({
                          ...p,
                          options: [...p.options, ""],
                        }))
                      }
                      className="btn btn-xs btn-soft btn-primary w-fit mt-1"
                    >
                      <Plus size={12} /> Add Option
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={addQuiz}
                className="btn btn-sm w-full btn-soft btn-primary rounded-xl font-bold self-start flex gap-1 items-center mt-2 disabled:opacity-50"
                disabled={
                  !newQuiz.question.trim() ||
                  newQuiz.options.filter((o) => o.trim()).length < 2
                }
              >
                <Plus size={13} /> Add Question
              </button>
            </div>
          )}

          {/* Playground */}
          {activeTab === "playground" && (
            <div className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-3">
              <p className="text-xs font-black text-base-content/50 uppercase tracking-wider">
                Default Playground Code
              </p>
              <textarea
                className="font-mono text-xs bg-neutral text-neutral-content p-4 rounded-2xl min-h-64 w-full resize-y focus:outline-none focus:ring-1 focus:ring-primary border border-neutral-content/10"
                value={tf.playgroundCode}
                onChange={(e) =>
                  setTopicForm((p) => ({
                    ...p,
                    playgroundCode: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>

        {/* Details Sidebar */}
        {!toggleDetails && (
          <div className="flex flex-col gap-4 md:overflow-y-auto h-full pb-10 pr-2">
            <div className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-2 py-4 md:p-5 flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-base-content/40">
              Topic Settings
            </h4>
            <Field label="Topic ID (path)">
              <input
                className={inputCls}
                value={tf.topicId}
                onChange={(e) =>
                  setTopicForm((p) => ({ ...p, topicId: e.target.value }))
                }
                placeholder="/introduction"
                disabled={topicId !== "NEW"}
              />
            </Field>
            <Field label="Title">
              <input
                className={inputCls}
                value={tf.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTopicForm((p) => {
                    const updates = { title: newTitle };
                    if (topicId === "NEW") {
                      updates.topicId = newTitle
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                    }
                    return { ...p, ...updates };
                  });
                }}
                placeholder="Introduction to React"
              />
            </Field>
            <Field label="Difficulty">
              <select
                className="select select-sm select-bordered bg-base-100 rounded-xl text-sm w-full"
                value={tf.difficulty}
                onChange={(e) =>
                  setTopicForm((p) => ({ ...p, difficulty: e.target.value }))
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
                value={tf.duration}
                onChange={(e) =>
                  setTopicForm((p) => ({ ...p, duration: e.target.value }))
                }
                placeholder="10 mins"
              />
            </Field>
            <Field label="Order">
              <input
                className={inputCls}
                type="number"
                value={tf.order}
                onChange={(e) =>
                  setTopicForm((p) => ({ ...p, order: +e.target.value }))
                }
              />
            </Field>

            <Field label="Playground">
              <ToggleSwitch
                checked={tf.playgroundEnabled}
                onChange={(val) =>
                  setTopicForm((p) => ({
                    ...p,
                    playgroundEnabled: val,
                  }))
                }
                label="Enable Playground"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default TopicEditor;
