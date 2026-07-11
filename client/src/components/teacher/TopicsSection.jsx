import React, { useState, useEffect, useCallback } from "react";
import { Plus, ArrowLeft, Save, Trash2, ArrowUp, ArrowDown, FileText, FilePlus, CheckCircle } from "lucide-react";
import { RichTextEditor } from "@imksh/editor";
import { cmsService } from "../../services/cmsService";
import { Field, inputCls, textareaCls } from "../common/SharedFields";

const TopicsSection = ({ selectedSubject, subjects }) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [topicForm, setTopicForm] = useState({ subjectKey: selectedSubject?.key || "", topicId: "", title: "", difficulty: "Beginner", duration: "10 mins", playgroundCode: "", quiz: [], sections: [], order: 0 });
  const [activeTab, setActiveTab] = useState("sections");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [newQuiz, setNewQuiz] = useState({ question: "", options: ["", "", "", ""], correctAnswerIndex: 0 });

  const subjectKey = selectedSubject?.key || topicForm.subjectKey;

  const fetchTopics = useCallback(async (key) => {
    if (!key) return;
    try { const { data } = await cmsService.getTopics({ subjectKey: key }); setTopics(data); }
    catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchTopics(subjectKey); }, [subjectKey, fetchTopics]);

  const initNew = () => {
    setSelectedTopicId("NEW");
    setTopicForm({ subjectKey, topicId: "", title: "", difficulty: "Beginner", duration: "10 mins", playgroundCode: `// Playground\nconsole.log("Hello World");`, quiz: [], sections: [{ title: "Introduction", content: "<p>Write lesson content here...</p>", task: null }], order: topics.length + 1 });
  };

  const selectTopic = (t) => { setSelectedTopicId(t.topicId); setTopicForm(t); };

  const saveTopic = async () => {
    setSaving(true); setSaveStatus("Saving...");
    try {
      const isNew = selectedTopicId === "NEW";
      const payload = { ...topicForm };
      if (!payload.subjectKey && selectedSubject) payload.subjectKey = selectedSubject.key;
      const { data } = isNew ? await cmsService.createTopic(payload) : await cmsService.updateTopic(topicForm.topicId, payload);
      setSaveStatus("Saved!"); fetchTopics(subjectKey); setSelectedTopicId(data.topicId); setTopicForm(data);
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) { setSaveStatus(""); alert(e.response?.data?.message || e.message); }
    finally { setSaving(false); }
  };

  const deleteTopic = async (id) => {
    if (!confirm("Delete this topic?")) return;
    await cmsService.deleteTopic(id); fetchTopics(subjectKey); setSelectedTopicId("");
  };

  const mutSec = (fn) => setTopicForm((p) => { const secs = [...p.sections]; fn(secs); return { ...p, sections: secs }; });
  const addSec = () => mutSec((s) => s.push({ title: `Section ${s.length + 1}`, content: "<p>Content here...</p>", task: null }));
  const removeSec = (i) => mutSec((s) => s.splice(i, 1));
  const moveSec = (i, dir) => mutSec((s) => { const ti = i + (dir === "up" ? -1 : 1); if (ti < 0 || ti >= s.length) return; [s[i], s[ti]] = [s[ti], s[i]]; });
  const setSec = (i, field, val) => mutSec((s) => { s[i] = { ...s[i], [field]: val }; });
  const toggleTask = (i) => mutSec((s) => { s[i].task = s[i].task ? null : { title: "Challenge", text: "Implement the concept.", points: 10, submissionType: "text" }; });
  const setTask = (i, field, val) => mutSec((s) => { s[i].task = { ...s[i].task, [field]: val }; });

  const addQuiz = () => { if (!newQuiz.question.trim()) return; setTopicForm((p) => ({ ...p, quiz: [...p.quiz, newQuiz] })); setNewQuiz({ question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }); };
  const removeQuiz = (i) => setTopicForm((p) => ({ ...p, quiz: p.quiz.filter((_, qi) => qi !== i) }));

  const tf = topicForm;
  const editing = !!selectedTopicId;

  return (
    <div className="flex h-full min-h-0">
      {/* Topic list panel */}
      <div className="w-72 shrink-0 border-r border-base-300/60 flex flex-col bg-base-200/40">
        <div className="flex items-center justify-between p-4 border-b border-base-300/60">
          <div className="min-w-0">
            <p className="text-sm font-extrabold truncate">
              {selectedSubject ? selectedSubject.title : "All Topics"}
            </p>
            <p className="text-[10px] text-base-content/40">{topics.length} topics</p>
          </div>
          <button onClick={initNew} className="btn btn-xs btn-primary btn-circle" title="New topic"><Plus size={12} /></button>
        </div>

        {/* Subject switcher */}
        {!selectedSubject && subjects.length > 0 && (
          <div className="p-3 border-b border-base-300/60">
            <select className="select select-xs select-bordered bg-base-100 rounded-xl text-xs w-full" value={topicForm.subjectKey} onChange={(e) => { setTopicForm((p) => ({ ...p, subjectKey: e.target.value })); fetchTopics(e.target.value); setSelectedTopicId(""); }}>
              <option value="">— Select Subject —</option>
              {subjects.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {topics.map((t) => (
            <button key={t.topicId} onClick={() => selectTopic(t)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between group ${selectedTopicId === t.topicId ? "bg-primary text-primary-content font-bold shadow-sm" : "hover:bg-base-300/70 text-base-content/70 font-medium"}`}>
              <span className="truncate">{t.title}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteTopic(t.topicId); }} className={`opacity-0 group-hover:opacity-100 p-0.5 rounded ${selectedTopicId === t.topicId ? "hover:bg-error/20 text-error" : "hover:bg-error/20 text-error/60"}`}><Trash2 size={11} /></button>
            </button>
          ))}
          {topics.length === 0 && <p className="text-xs text-base-content/30 text-center py-6">No topics yet</p>}
        </div>
      </div>

      {/* Topic editor */}
      {editing ? (
        <div className="flex-1 overflow-y-auto">
          {/* Editor header */}
          <div className="sticky top-0 z-10 bg-base-100/90 backdrop-blur-sm border-b border-base-300/60 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSelectedTopicId("")} className="btn btn-xs btn-ghost rounded-lg"><ArrowLeft size={14} /></button>
              <div className="min-w-0">
                <p className="text-sm font-extrabold truncate">{tf.title || "New Topic"}</p>
                <p className="text-[10px] text-base-content/40">{tf.topicId || "unsaved"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {saveStatus && <span className="text-xs text-success font-bold">{saveStatus}</span>}
              <button onClick={saveTopic} disabled={saving} className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center shadow-md">
                {saving ? <span className="loading loading-spinner loading-xs" /> : <><Save size={13} /> Save</>}
              </button>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Meta fields */}
            <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-base-content/40">Topic Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Topic ID (path)"><input className={inputCls} value={tf.topicId} onChange={(e) => setTopicForm((p) => ({ ...p, topicId: e.target.value }))} placeholder="/introduction" disabled={selectedTopicId !== "NEW"} /></Field>
                <Field label="Title"><input className={inputCls} value={tf.title} onChange={(e) => setTopicForm((p) => ({ ...p, title: e.target.value }))} placeholder="Introduction to React" /></Field>
                <Field label="Difficulty">
                  <select className="select select-sm select-bordered bg-base-100 rounded-xl text-sm" value={tf.difficulty} onChange={(e) => setTopicForm((p) => ({ ...p, difficulty: e.target.value }))}>
                    {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Duration"><input className={inputCls} value={tf.duration} onChange={(e) => setTopicForm((p) => ({ ...p, duration: e.target.value }))} placeholder="10 mins" /></Field>
                <Field label="Order"><input className={inputCls} type="number" value={tf.order} onChange={(e) => setTopicForm((p) => ({ ...p, order: +e.target.value }))} /></Field>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-box bg-base-200 p-1 rounded-2xl w-fit flex gap-1">
              {["sections", "quiz", "playground"].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)} className={`tab tab-sm font-bold rounded-xl capitalize ${activeTab === t ? "tab-active bg-primary text-primary-content!" : ""}`}>{t}</button>
              ))}
            </div>

            {/* Sections Tab */}
            {activeTab === "sections" && (
              <div className="flex flex-col gap-4">
                {tf.sections.map((sec, i) => (
                  <div key={i} className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-neutral badge-sm font-black">§{i + 1}</span>
                        <input className="input input-xs bg-transparent border-none font-bold text-sm focus:outline-none w-48" value={sec.title} onChange={(e) => setSec(i, "title", e.target.value)} placeholder="Section title..." />
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveSec(i, "up")} disabled={i === 0} className="btn btn-xs btn-ghost rounded-lg opacity-50 hover:opacity-100"><ArrowUp size={12} /></button>
                        <button onClick={() => moveSec(i, "down")} disabled={i === tf.sections.length - 1} className="btn btn-xs btn-ghost rounded-lg opacity-50 hover:opacity-100"><ArrowDown size={12} /></button>
                        <button onClick={() => removeSec(i)} className="btn btn-xs btn-ghost text-error rounded-lg"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-base-300">
                      <RichTextEditor value={sec.content} onChange={(val) => setSec(i, "content", val)} />
                    </div>
                    {/* Task toggle */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleTask(i)} className={`btn btn-xs rounded-xl font-bold ${sec.task ? "btn-warning btn-soft" : "btn-ghost border border-base-300"}`}>
                        {sec.task ? "Remove Task" : "+ Add Task"}
                      </button>
                    </div>
                    {sec.task && (
                      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex flex-col gap-3">
                        <p className="text-[11px] font-black text-primary uppercase tracking-wider">Task Configuration</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Field label="Task Title"><input className={inputCls} value={sec.task.title} onChange={(e) => setTask(i, "title", e.target.value)} /></Field>
                          <Field label="Points"><input className={inputCls} type="number" value={sec.task.points} onChange={(e) => setTask(i, "points", +e.target.value)} /></Field>
                          <Field label="Submission Type">
                            <select className="select select-sm select-bordered bg-base-100 rounded-xl text-sm w-full" value={sec.task.submissionType} onChange={(e) => setTask(i, "submissionType", e.target.value)}>
                              {["text", "playground", "file"].map((t) => <option key={t}>{t}</option>)}
                            </select>
                          </Field>
                        </div>
                        <Field label="Instructions">
                          <textarea className={textareaCls} rows={2} value={sec.task.text} onChange={(e) => setTask(i, "text", e.target.value)} />
                        </Field>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={addSec} className="btn btn-sm btn-ghost rounded-2xl border border-dashed border-base-300 font-bold flex gap-1 items-center hover:border-primary/50 hover:text-primary">
                  <FilePlus size={14} /> Add Section
                </button>
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === "quiz" && (
              <div className="flex flex-col gap-4">
                {tf.quiz.map((q, i) => (
                  <div key={i} className="card bg-base-200/60 border border-base-300/60 rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-primary badge-sm font-black">Q{i + 1}</span>
                      <button onClick={() => removeQuiz(i)} className="btn btn-xs btn-ghost text-error rounded-lg"><Trash2 size={12} /></button>
                    </div>
                    <p className="text-sm font-semibold">{q.question}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`text-xs px-3 py-1.5 rounded-xl border ${oi === q.correctAnswerIndex ? "bg-success/15 border-success/30 text-success font-bold" : "bg-base-100 border-base-300 text-base-content/60"}`}>
                          {oi === q.correctAnswerIndex && <CheckCircle size={10} className="inline mr-1" />}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-3">
                  <p className="text-xs font-black text-base-content/50 uppercase tracking-wider">Add Question</p>
                  <Field label="Question">
                    <input className={inputCls} value={newQuiz.question} onChange={(e) => setNewQuiz((p) => ({ ...p, question: e.target.value }))} placeholder="What does JSX stand for?" />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    {newQuiz.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input type="radio" checked={newQuiz.correctAnswerIndex === i} onChange={() => setNewQuiz((p) => ({ ...p, correctAnswerIndex: i }))} className="radio radio-success radio-xs" />
                        <input className={inputCls} value={opt} onChange={(e) => { const opts = [...newQuiz.options]; opts[i] = e.target.value; setNewQuiz((p) => ({ ...p, options: opts })); }} placeholder={`Option ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                  <button onClick={addQuiz} className="btn btn-sm btn-primary rounded-xl font-bold self-start flex gap-1 items-center">
                    <Plus size={13} /> Add Question
                  </button>
                </div>
              </div>
            )}

            {/* Playground Tab */}
            {activeTab === "playground" && (
              <div className="card bg-base-200/60 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-3">
                <p className="text-xs font-black text-base-content/50 uppercase tracking-wider">Default Playground Code</p>
                <textarea className="font-mono text-xs bg-neutral text-neutral-content p-4 rounded-2xl min-h-64 w-full resize-y focus:outline-none focus:ring-1 focus:ring-primary border border-neutral-content/10" value={tf.playgroundCode} onChange={(e) => setTopicForm((p) => ({ ...p, playgroundCode: e.target.value }))} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-base-content/30">
          <FileText size={48} strokeWidth={1} />
          <p className="text-sm font-semibold">Select or create a topic</p>
        </div>
      )}
    </div>
  );
};

export default TopicsSection;
