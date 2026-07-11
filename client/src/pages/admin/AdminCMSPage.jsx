import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Layers,
  ChevronRight,
  BookOpen,
  FileText,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  FilePlus,
  CheckCircle,
} from "lucide-react";
import { RichTextEditor } from "@imksh/editor";
import { cmsService } from "../../services/cmsService";
import {
  Field,
  inputCls,
  textareaCls,
} from "../../components/common/SharedFields";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Breadcrumbs } from "../../components/common/Breadcrumbs";

export const AdminCMSPage = () => {
  const { moduleId, subjectKey, topicId } = useParams();
  const navigate = useNavigate();

  // Data states
  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  // Selected entities (for breadcrumbs/titles)
  const currentModule = modules.find((m) => m._id === moduleId);
  const currentSubject = subjects.find((s) => s.key === subjectKey);
  const currentTopic = topics.find((t) => t.topicId === topicId);

  // Modals & Form states
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    icon: "BookOpen",
    color: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
    order: 0,
  });
  const [editingModuleId, setEditingModuleId] = useState(null);

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    key: "",
    title: "",
    icon: "BookOpen",
    desc: "",
    color: "border-blue-500/30 bg-blue-500/5",
    iconColor: "text-blue-500",
    path: "",
    order: 0,
    moduleId: "",
  });
  const [editingSubjectKey, setEditingSubjectKey] = useState(null);

  const [saving, setSaving] = useState(false);

  // Topic Editor states
  const [topicForm, setTopicForm] = useState({
    subjectKey: "",
    topicId: "",
    title: "",
    difficulty: "Beginner",
    duration: "10 mins",
    playgroundCode: "",
    quiz: [],
    sections: [],
    order: 0,
  });
  const [activeTab, setActiveTab] = useState("sections");
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
  });
  const [saveStatus, setSaveStatus] = useState("");

  // 1. FETCH DATA
  const fetchModules = useCallback(async () => {
    try {
      const { data } = await cmsService.getModules();
      setModules(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const { data } = await cmsService.getSubjects();
      setSubjects(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchTopics = useCallback(async (key) => {
    if (!key) return;
    try {
      const { data } = await cmsService.getTopics({ subjectKey: key });
      setTopics(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchModules();
    fetchSubjects();
  }, [fetchModules, fetchSubjects]);

  useEffect(() => {
    if (subjectKey) {
      fetchTopics(subjectKey);
    }
  }, [subjectKey, fetchTopics]);

  useEffect(() => {
    if (topicId && topics.length > 0) {
      const found = topics.find((t) => t.topicId === topicId);
      if (found) {
        setTopicForm(found);
      }
    }
  }, [topicId, topics]);

  // 2. MODULE CRUD ACTIONS
  const openNewModule = () => {
    setEditingModuleId(null);
    setModuleForm({
      title: "",
      description: "",
      icon: "BookOpen",
      color: "",
      iconColor: "text-primary",
      order: modules.length + 1,
    });
    setModuleModalOpen(true);
  };

  const openEditModule = (mod) => {
    setEditingModuleId(mod._id);
    setModuleForm({
      title: mod.title,
      description: mod.description,
      icon: mod.icon,
      color: mod.color,
      iconColor: mod.iconColor,
      order: mod.order,
    });
    setModuleModalOpen(true);
  };

  const saveModule = async () => {
    setSaving(true);
    try {
      if (editingModuleId) {
        await cmsService.updateModule(editingModuleId, moduleForm);
      } else {
        await cmsService.createModule(moduleForm);
      }
      await fetchModules();
      setModuleModalOpen(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (id) => {
    if (!confirm("Delete this module? Subjects will be detached.")) return;
    try {
      await cmsService.deleteModule(id);
      await fetchModules();
      if (moduleId === id) navigate("/admin/cms");
    } catch (e) {
      alert(e.message);
    }
  };

  // 3. SUBJECT CRUD ACTIONS
  const openNewSubject = () => {
    setEditingSubjectKey(null);
    setSubjectForm({
      key: "",
      title: "",
      icon: "BookOpen",
      desc: "",
      color: "",
      iconColor: "text-blue-500",
      path: "",
      order: subjects.length + 1,
      moduleId: moduleId || "",
    });
    setSubjectModalOpen(true);
  };

  const openEditSubject = (sub) => {
    setEditingSubjectKey(sub.key);
    setSubjectForm({ ...sub, moduleId: sub.module?._id || sub.module || "" });
    setSubjectModalOpen(true);
  };

  const saveSubject = async () => {
    setSaving(true);
    try {
      if (editingSubjectKey) {
        await cmsService.updateSubject(editingSubjectKey, subjectForm);
      } else {
        await cmsService.createSubject(subjectForm);
      }
      await fetchSubjects();
      setSubjectModalOpen(false);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSubject = async (key) => {
    if (!confirm("Delete subject and all its topics?")) return;
    try {
      await cmsService.deleteSubject(key);
      await fetchSubjects();
      if (subjectKey === key) navigate(`/admin/cms/${moduleId}`);
    } catch (e) {
      alert(e.message);
    }
  };

  // 4. TOPIC CRUD ACTIONS
  const initNewTopic = () => {
    navigate(`/admin/cms/${moduleId}/${subjectKey}/NEW`);
    setTopicForm({
      subjectKey,
      topicId: "",
      title: "",
      difficulty: "Beginner",
      duration: "10 mins",
      playgroundCode: `// Playground\nconsole.log("Hello World");`,
      quiz: [],
      sections: [
        {
          title: "Introduction",
          content: "<p>Write lesson content here...</p>",
          task: null,
        },
      ],
      order: topics.length + 1,
    });
  };

  const saveTopic = async () => {
    setSaving(true);
    setSaveStatus("Saving...");
    try {
      const isNew = topicId === "NEW";
      const payload = { ...topicForm };
      if (!payload.subjectKey && subjectKey) payload.subjectKey = subjectKey;

      const { data } = isNew
        ? await cmsService.createTopic(payload)
        : await cmsService.updateTopic(topicForm.topicId, payload);

      setSaveStatus("Saved!");
      await fetchTopics(subjectKey);
      navigate(`/admin/cms/${moduleId}/${subjectKey}/${data.topicId}`);
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) {
      setSaveStatus("");
      alert(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTopic = async (id) => {
    if (!confirm("Delete this topic?")) return;
    try {
      await cmsService.deleteTopic(id);
      await fetchTopics(subjectKey);
      navigate(`/admin/cms/${moduleId}/${subjectKey}`);
    } catch (e) {
      alert(e.message);
    }
  };

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
        title: `Section ${s.length + 1}`,
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
      s[i].task = s[i].task
        ? null
        : {
            title: "Challenge",
            text: "Implement the concept.",
            points: 10,
            submissionType: "text",
          };
    });
  const setTask = (i, field, val) =>
    mutSec((s) => {
      s[i].task = { ...s[i].task, [field]: val };
    });

  const addQuiz = () => {
    if (!newQuiz.question.trim()) return;
    setTopicForm((p) => ({ ...p, quiz: [...p.quiz, newQuiz] }));
    setNewQuiz({
      question: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    });
  };
  const removeQuiz = (i) =>
    setTopicForm((p) => ({ ...p, quiz: p.quiz.filter((_, qi) => qi !== i) }));

  const getBreadcrumbs = () => {
    const list = [{ label: "CMS", path: "/admin/cms" }];
    if (currentModule) {
      list.push({
        label: currentModule.title,
        path: `/admin/cms/${currentModule._id}`,
      });
    }
    if (currentSubject) {
      list.push({
        label: currentSubject.title,
        path: `/admin/cms/${currentModule?._id}/${currentSubject.key}`,
      });
    }
    if (topicId) {
      list.push({
        label: topicId === "NEW" ? "New Topic" : currentTopic?.title || "Topic",
      });
    }
    return list;
  };

  const renderModulesList = () => {
    return (
      <div className="flex flex-col gap-6">
        {modules.length === 0 ? (
          <div className="bg-base-200/50 border border-dashed border-base-300 rounded-3xl p-8 text-center text-sm text-base-content/40">
            No modules yet. Create your first module to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div
                key={mod._id}
                className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 hover:border-primary/40 transition-all flex flex-col justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    <p className="font-extrabold text-sm truncate">
                      {mod.title}
                    </p>
                  </div>
                  <p className="text-xs text-base-content/50 mt-2 line-clamp-3 leading-relaxed min-h-[50px]">
                    {mod.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-base-300/40 pt-3">
                  <button
                    onClick={() => navigate(`/admin/cms/${mod._id}`)}
                    className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                  >
                    Subjects <ChevronRight size={12} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModule(mod)}
                      className="btn btn-xs btn-ghost btn-square rounded-lg"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => deleteModule(mod._id)}
                      className="btn btn-xs btn-ghost btn-square text-error rounded-lg"
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
    );
  };

  const renderSubjectsList = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleSubjects.map((sub) => (
              <div
                key={sub.key}
                className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-4"
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
                    onClick={() =>
                      navigate(`/admin/cms/${moduleId}/${sub.key}`)
                    }
                    className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                  >
                    Topics <ChevronRight size={12} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditSubject(sub)}
                      className="btn btn-xs btn-ghost btn-square rounded-lg"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => deleteSubject(sub.key)}
                      className="btn btn-xs btn-ghost btn-square text-error rounded-lg"
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
    );
  };

  const renderTopicsList = () => {
    return (
      <div className="flex flex-col gap-6">
        {topics.length === 0 ? (
          <div className="bg-base-200/50 border border-dashed border-base-300 rounded-3xl p-8 text-center text-sm text-base-content/40">
            No topics inside this subject yet. Create your first topic.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <div
                key={t.topicId}
                className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 hover:border-amber-500/30 transition-all flex flex-col justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    <p className="font-extrabold text-sm truncate">{t.title}</p>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="badge badge-outline text-[10px] py-1">
                      {t.difficulty}
                    </span>
                    <span className="badge badge-outline text-[10px] py-1">
                      {t.duration}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-base-300/40 pt-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/cms/${moduleId}/${subjectKey}/${t.topicId}`,
                      )
                    }
                    className="btn btn-xs btn-primary rounded-lg font-bold flex gap-1 items-center"
                  >
                    Edit Content <ChevronRight size={12} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteTopic(t.topicId)}
                      className="btn btn-xs btn-ghost btn-square text-error rounded-lg"
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
    );
  };

  const renderTopicEditor = () => {
    const tf = topicForm;
    return (
      <div className="flex flex-col gap-6">
        {/* Form configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="tabs tabs-box bg-base-200 p-1 rounded-2xl w-fit flex gap-1">
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

            {/* Sections */}
            {activeTab === "sections" && (
              <div className="flex flex-col gap-4">
                {tf.sections?.map((sec, i) => (
                  <div
                    key={i}
                    className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-neutral badge-sm font-black">
                          §{i + 1}
                        </span>
                        <input
                          className="input input-xs bg-transparent border-none font-bold text-sm focus:outline-none w-48"
                          value={sec.title}
                          onChange={(e) => setSec(i, "title", e.target.value)}
                          placeholder="Section title..."
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSec(i, "up")}
                          disabled={i === 0}
                          className="btn btn-xs btn-ghost rounded-lg opacity-50 hover:opacity-100"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => moveSec(i, "down")}
                          disabled={i === tf.sections.length - 1}
                          className="btn btn-xs btn-ghost rounded-lg opacity-50 hover:opacity-100"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          onClick={() => removeSec(i)}
                          className="btn btn-xs btn-ghost text-error rounded-lg"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-base-300">
                      <RichTextEditor
                        value={sec.content}
                        onChange={(val) => setSec(i, "content", val)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTask(i)}
                        className={`btn btn-xs rounded-xl font-bold ${sec.task ? "btn-warning btn-soft" : "btn-ghost border border-base-300"}`}
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
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={addSec}
                  className="btn btn-sm btn-ghost rounded-2xl border border-dashed border-base-300 font-bold flex gap-1 items-center hover:border-primary/50 hover:text-primary py-4"
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
                        onClick={() => removeQuiz(i)}
                        className="btn btn-xs btn-ghost text-error rounded-lg"
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
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {newQuiz.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          checked={newQuiz.correctAnswerIndex === i}
                          onChange={() =>
                            setNewQuiz((p) => ({ ...p, correctAnswerIndex: i }))
                          }
                          className="radio radio-success radio-xs"
                        />
                        <input
                          className={inputCls}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...newQuiz.options];
                            opts[i] = e.target.value;
                            setNewQuiz((p) => ({ ...p, options: opts }));
                          }}
                          placeholder={`Option ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addQuiz}
                    className="btn btn-sm btn-primary rounded-xl font-bold self-start flex gap-1 items-center mt-2"
                  >
                    <Plus size={13} /> Add Question
                  </button>
                </div>
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
          <div className="flex flex-col gap-4">
            <div className="card bg-base-200/50 border border-base-300/60 rounded-3xl p-5 flex flex-col gap-4">
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
                  onChange={(e) =>
                    setTopicForm((p) => ({ ...p, title: e.target.value }))
                  }
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getActions = () => {
    if (!moduleId) {
      return (
        <button
          onClick={openNewModule}
          className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
        >
          <Plus size={14} /> New Module
        </button>
      );
    }
    if (moduleId && !subjectKey) {
      return (
        <button
          onClick={openNewSubject}
          className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
        >
          <Plus size={14} /> New Subject
        </button>
      );
    }
    if (moduleId && subjectKey && !topicId) {
      return (
        <button
          onClick={initNewTopic}
          className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
        >
          <Plus size={14} /> New Topic
        </button>
      );
    }
    if (moduleId && subjectKey && topicId) {
      return (
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs text-success font-bold animate-pulse">
              {saveStatus}
            </span>
          )}
          <button
            onClick={saveTopic}
            disabled={saving}
            className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center shadow-md"
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <>
                <Save size={13} /> Save Topic
              </>
            )}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout
      breadcrumbs={<Breadcrumbs items={getBreadcrumbs()} />}
      actions={getActions()}
    >
      <div className="p-6 max-w-7xl mx-auto flex flex-col min-h-full">
        {/* View Routing */}
        {!moduleId && renderModulesList()}
        {moduleId && !subjectKey && renderSubjectsList()}
        {moduleId && subjectKey && !topicId && renderTopicsList()}
        {moduleId && subjectKey && topicId && renderTopicEditor()}

        {/* Module CRUD Modal */}
        {moduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl animate-zoomIn">
              <div className="flex justify-between items-center pb-2 border-b border-base-300/40">
                <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
                  <Edit3 size={14} />{" "}
                  {editingModuleId ? "Edit Module" : "New Module"}
                </h3>
                <button
                  onClick={() => setModuleModalOpen(false)}
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
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setModuleModalOpen(false)}
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
        )}

        {/* Subject CRUD Modal */}
        {subjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="card bg-base-100 border border-base-300/60 rounded-3xl p-6 flex flex-col gap-4 w-full max-w-lg shadow-2xl animate-zoomIn">
              <div className="flex justify-between items-center pb-2 border-b border-base-300/40">
                <h3 className="text-sm font-extrabold text-base-content/70 flex items-center gap-2">
                  <Edit3 size={14} />{" "}
                  {editingSubjectKey ? "Edit Subject" : "New Subject"}
                </h3>
                <button
                  onClick={() => setSubjectModalOpen(false)}
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
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setSubjectModalOpen(false)}
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
        )}
      </div>
    </AdminLayout>
  );
};
