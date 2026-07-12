import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
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
  Globe,
  Lock,
  GripVertical,
  ArrowRightLeft,
} from "lucide-react";
import { Reorder } from "motion/react";
import { RichTextEditor } from "@imksh/editor";
import { cmsService } from "../../services/cmsService";
import { useAuthStore } from "../../store/useAuthStore";
import { useCacheStore } from "../../stores/useCacheStore";
import Loading from "../../components/Loading";
import {
  Field,
  inputCls,
  textareaCls,
} from "../../components/common/SharedFields";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Breadcrumbs } from "../../components/common/Breadcrumbs";
import ModuleModal from "../../components/admin/modals/ModuleModal";
import SubjectModal from "../../components/admin/modals/SubjectModal";
import TopicModal from "../../components/admin/modals/TopicModal";
import ModulesList from "../../components/admin/cms/ModulesList";
import SubjectsList from "../../components/admin/cms/SubjectsList";
import TopicsList from "../../components/admin/cms/TopicsList";
import TopicEditor from "../../components/admin/cms/TopicEditor";
import { useConfirm } from "../../contexts/ConfirmContext";
import useWindowSize from "../../hooks/useWindowSize";

export const AdminCMSPage = () => {
  const { moduleId, subjectKey, topicId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const basePath = isAdmin ? "/admin" : "/teacher";
  const [loading, setLoading] = useState(false);
  const size = useWindowSize();

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
    isPublic: false,
  });
  const [editingSubjectKey, setEditingSubjectKey] = useState(null);

  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicInitialForm, setTopicInitialForm] = useState({
    title: "",
    topicId: "",
    difficulty: "Beginner",
    duration: "10 mins",
    order: 0,
  });

  // Reorder states
  const [isReorderingModules, setIsReorderingModules] = useState(false);
  const [localModules, setLocalModules] = useState([]);
  const [savingReorder, setSavingReorder] = useState(false);

  const [isReorderingSubjects, setIsReorderingSubjects] = useState(false);
  const [localSubjects, setLocalSubjects] = useState([]);
  const [savingReorderSubjects, setSavingReorderSubjects] = useState(false);

  const [isReorderingTopics, setIsReorderingTopics] = useState(false);
  const [localTopics, setLocalTopics] = useState([]);
  const [savingReorderTopics, setSavingReorderTopics] = useState(false);

  useEffect(() => {
    setLocalModules(modules);
  }, [modules]);

  useEffect(() => {
    setLocalTopics(topics);
  }, [topics]);

  useEffect(() => {
    setLocalSubjects(
      subjects.filter(
        (s) => s.module?._id === moduleId || s.module === moduleId,
      ),
    );
  }, [subjects, moduleId]);

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
    playgroundEnabled: false,
  });
  const [activeTab, setActiveTab] = useState("sections");
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    options: ["", ""],
    correctAnswerIndex: 0,
  });
  const [saveStatus, setSaveStatus] = useState("");

  // 1. FETCH DATA
  const fetchModules = useCallback(async (force = true) => {
    try {
      if (!force && useCacheStore.getState().modules) {
        setModules(useCacheStore.getState().modules);
        return;
      }
      setLoading(true);
      const { data } = await cmsService.getModules();
      setModules(data);
      useCacheStore.getState().setModules(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async (force = true) => {
    try {
      if (!force && useCacheStore.getState().subjects) {
        setSubjects(useCacheStore.getState().subjects);
        return;
      }
      setLoading(true);
      const { data } = await cmsService.getSubjects();
      setSubjects(data);
      useCacheStore.getState().setSubjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopics = useCallback(async (key, force = true) => {
    if (!key) return;
    try {
      if (!force && useCacheStore.getState().topicsBySubject[key]) {
        setTopics(useCacheStore.getState().topicsBySubject[key]);
        return;
      }
      setLoading(true);
      const { data } = await cmsService.getTopics({ subjectKey: key });
      setTopics(data);
      useCacheStore.getState().setTopicsForSubject(key, data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules(false);
    fetchSubjects(false);
  }, [fetchModules, fetchSubjects]);

  useEffect(() => {
    if (subjectKey) {
      fetchTopics(subjectKey, false);
    }
  }, [subjectKey, fetchTopics]);

  useEffect(() => {
    if (!topicId) {
      setTopicForm({
        subjectKey: "",
        topicId: "",
        title: "",
        difficulty: "Beginner",
        duration: "10 mins",
        playgroundCode: "",
        quiz: [],
        sections: [],
        order: 0,
        playgroundEnabled: false,
      });
      return;
    }

    if (topics.length > 0) {
      const found = topics.find((t) => t.topicId === topicId);
      if (found) {
        setTopicForm(found);
      } else {
        setTopicForm({
          subjectKey: "",
          topicId: "",
          title: "",
          difficulty: "Beginner",
          duration: "10 mins",
          playgroundCode: "",
          quiz: [],
          sections: [],
          order: 0,
          playgroundEnabled: false,
        });
      }
    } else {
      setTopicForm({
        subjectKey: "",
        topicId: "",
        title: "",
        difficulty: "Beginner",
        duration: "10 mins",
        playgroundCode: "",
        quiz: [],
        sections: [],
        order: 0,
        playgroundEnabled: false,
      });
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
      isPublic: false,
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
      isPublic: !!mod.isPublic,
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
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (id) => {
    if (!(await confirm("Delete this module? Subjects will be detached.")))
      return;
    try {
      await cmsService.deleteModule(id);
      await fetchModules();
      if (moduleId === id) navigate(`${basePath}/cms`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const quickTogglePublic = async (mod, e) => {
    e.stopPropagation();
    setTogglingId(mod._id);
    try {
      await cmsService.updateModule(mod._id, { isPublic: !mod.isPublic });
      await fetchModules();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSaveModulesReorder = async () => {
    setSavingReorder(true);
    try {
      const orderData = localModules.map((m, i) => ({ id: m._id, order: i }));
      await cmsService.reorderModules(orderData);
      await fetchModules();
      setIsReorderingModules(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSavingReorder(false);
    }
  };

  const handleSaveSubjectsReorder = async () => {
    setSavingReorderSubjects(true);
    try {
      const orderData = localSubjects.map((s, i) => ({ key: s.key, order: i }));
      await cmsService.reorderSubjects(orderData);
      await fetchSubjects();
      setIsReorderingSubjects(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSavingReorderSubjects(false);
    }
  };

  const handleSaveTopicsReorder = async () => {
    setSavingReorderTopics(true);
    try {
      const orderData = localTopics.map((t, i) => ({
        topicId: t.topicId,
        order: i,
      }));
      await cmsService.reorderTopics(orderData);
      await fetchTopics(subjectKey);
      setIsReorderingTopics(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSavingReorderTopics(false);
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
      isPublic: false,
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
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSubject = async (key) => {
    if (!(await confirm("Delete subject and all its topics?"))) return;
    try {
      await cmsService.deleteSubject(key);
      await fetchSubjects();
      if (subjectKey === key) navigate(`${basePath}/cms/${moduleId}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  // 4. TOPIC CRUD ACTIONS
  const openNewTopicModal = () => {
    setTopicInitialForm({
      title: "",
      topicId: "",
      difficulty: "Beginner",
      duration: "10 mins",
      order: topics.length + 1,
    });
    setTopicModalOpen(true);
  };

  const handleCreateTopic = async () => {
    setSaving(true);
    try {
      const payload = {
        ...topicInitialForm,
        subjectKey,
        playgroundCode: `// Playground\nconsole.log("Hello World");`,
        quiz: [],
        sections: [
          {
            title: "Introduction",
            content: "<p>Write lesson content here...</p>",
            task: null,
          },
        ],
      };
      const { data } = await cmsService.createTopic(payload);
      await fetchTopics(subjectKey);
      setTopicModalOpen(false);
      navigate(
        `${basePath}/cms/${moduleId}/${subjectKey}/${encodeURIComponent(data.topicId)}`,
      );
      toast.success("Topic created successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveTopic = async () => {
    if (!topicForm.title || !topicForm.topicId) {
      toast.error("Title and Topic ID are required!");
      return;
    }

    setSaving(true);
    setSaveStatus("Saving...");
    try {
      const payload = { ...topicForm };

      const { data } = await cmsService.updateTopic(topicForm._id, payload);

      setSaveStatus("Saved!");
      setTopicForm(data);
      await fetchTopics(subjectKey);
      navigate(
        `${basePath}/cms/${moduleId}/${subjectKey}/${encodeURIComponent(data.topicId)}`,
        { replace: true },
      );
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) {
      setSaveStatus("");
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTopic = async (id) => {
    if (!(await confirm("Delete this topic?"))) return;
    try {
      await cmsService.deleteTopic(id);
      await fetchTopics(subjectKey);
      navigate(`${basePath}/cms/${moduleId}/${subjectKey}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const getBreadcrumbs = () => {
    const list = [{ label: "CMS", path: `${basePath}/cms` }];
    if (currentModule) {
      list.push({
        label: currentModule.title,
        path: `${basePath}/cms/${currentModule._id}`,
      });
    }
    if (currentSubject) {
      list.push({
        label: currentSubject.title,
        path: `${basePath}/cms/${currentModule?._id}/${currentSubject.key}`,
      });
    }
    if (topicId) {
      list.push({
        label: topicId === "NEW" ? "New Topic" : currentTopic?.title || "Topic",
      });
    }
    return list;
  };

  const getActions = () => {
    if (!moduleId) {
      return (
        <div className="flex gap-2">
          {isReorderingModules ? (
            <>
              <button
                onClick={() => {
                  setIsReorderingModules(false);
                  setLocalModules(modules);
                }}
                className="btn btn-sm btn-ghost"
                disabled={savingReorder}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModulesReorder}
                className="btn btn-sm btn-primary flex gap-2 items-center"
                disabled={savingReorder}
              >
                {savingReorder ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Save size={14} />
                )}
                Save {size.width > 648 && "Order"}
              </button>
            </>
          ) : (
            <>
              {modules.length > 1 && (
                <button
                  onClick={() => setIsReorderingModules(true)}
                  className="btn btn-sm btn-outline font-bold flex gap-2 items-center text-base-content border-base-300"
                >
                  <ArrowRightLeft size={14} className="rotate-90" />
                  {size.width > 648 && "Reorder"}
                </button>
              )}
              <button
                onClick={openNewModule}
                className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
              >
                <Plus size={14} /> New {size.width > 648 && "Module"}
              </button>
            </>
          )}
        </div>
      );
    }
    if (moduleId && !subjectKey) {
      return (
        <div className="flex gap-2">
          {isReorderingSubjects ? (
            <>
              <button
                onClick={() => {
                  setIsReorderingSubjects(false);
                  setLocalSubjects(subjects);
                }}
                className="btn btn-sm btn-ghost"
                disabled={savingReorderSubjects}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubjectsReorder}
                className="btn btn-sm btn-primary flex gap-2 items-center"
                disabled={savingReorderSubjects}
              >
                {savingReorderSubjects ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Save size={14} />
                )}
                Save {size.width > 648 && "Order"}
              </button>
            </>
          ) : (
            <>
              {subjects.length > 1 && (
                <button
                  onClick={() => setIsReorderingSubjects(true)}
                  className="btn btn-sm btn-outline font-bold flex gap-2 items-center text-base-content border-base-300"
                >
                  <ArrowRightLeft size={14} className="rotate-90" />
                  {size.width > 648 && "Reorder"}
                </button>
              )}
              <button
                onClick={openNewSubject}
                className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
              >
                <Plus size={14} /> New {size.width > 648 && "Subject"}
              </button>
            </>
          )}
        </div>
      );
    }
    if (moduleId && subjectKey && !topicId) {
      return (
        <div className="flex gap-2">
          {isReorderingTopics ? (
            <>
              <button
                onClick={() => {
                  setIsReorderingTopics(false);
                  setLocalTopics(topics);
                }}
                className="btn btn-sm btn-ghost"
                disabled={savingReorderTopics}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTopicsReorder}
                className="btn btn-sm btn-primary flex gap-2 items-center"
                disabled={savingReorderTopics}
              >
                {savingReorderTopics ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Save size={14} />
                )}
                Save {size.width > 648 && "Order"}
              </button>
            </>
          ) : (
            <>
              {topics.length > 1 && (
                <button
                  onClick={() => setIsReorderingTopics(true)}
                  className="btn btn-sm btn-outline font-bold flex gap-2 items-center text-base-content border-base-300"
                >
                  <ArrowRightLeft size={14} className="rotate-90" />
                  {size.width > 648 && "Reorder"}
                </button>
              )}
              <button
                onClick={openNewTopicModal}
                className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
              >
                <Plus size={14} /> New {size.width > 648 && "Topic"}
              </button>
            </>
          )}
        </div>
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

  const pageTitle =
    currentTopic?.title ||
    currentSubject?.title ||
    currentModule?.title ||
    "Modules";

  return (
    <AdminLayout
      title={pageTitle}
      breadcrumbs={<Breadcrumbs items={getBreadcrumbs()} />}
      actions={getActions()}
    >
      <div className="px-2 py-6 md:p-6 max-w-7xl mx-auto flex flex-col min-h-full relative">
        {/* View Routing */}
        {loading && <Loading />}
        {!moduleId && (
          <ModulesList
            modules={modules}
            localModules={localModules}
            setLocalModules={setLocalModules}
            isReorderingModules={isReorderingModules}
            setIsReorderingModules={setIsReorderingModules}
            savingReorder={savingReorder}
            handleSaveModulesReorder={handleSaveModulesReorder}
            quickTogglePublic={quickTogglePublic}
            togglingId={togglingId}
            navigate={navigate}
            basePath={basePath}
            openEditModule={openEditModule}
            deleteModule={deleteModule}
          />
        )}
        {moduleId && !subjectKey && (
          <SubjectsList
            moduleId={moduleId}
            subjects={subjects.filter(
              (s) => s.module?._id === moduleId || s.module === moduleId,
            )}
            localSubjects={localSubjects}
            setLocalSubjects={setLocalSubjects}
            isReorderingSubjects={isReorderingSubjects}
            setIsReorderingSubjects={setIsReorderingSubjects}
            savingReorderSubjects={savingReorderSubjects}
            handleSaveSubjectsReorder={handleSaveSubjectsReorder}
            navigate={navigate}
            basePath={basePath}
            openEditSubject={openEditSubject}
            deleteSubject={deleteSubject}
          />
        )}
        {moduleId && subjectKey && !topicId && (
          <TopicsList
            topics={topics}
            localTopics={localTopics}
            setLocalTopics={setLocalTopics}
            isReorderingTopics={isReorderingTopics}
            setIsReorderingTopics={setIsReorderingTopics}
            savingReorderTopics={savingReorderTopics}
            handleSaveTopicsReorder={handleSaveTopicsReorder}
            navigate={navigate}
            basePath={basePath}
            moduleId={moduleId}
            subjectKey={subjectKey}
            deleteTopic={deleteTopic}
          />
        )}
        {moduleId && subjectKey && topicId && (
          <TopicEditor
            topicForm={topicForm}
            setTopicForm={setTopicForm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            newQuiz={newQuiz}
            setNewQuiz={setNewQuiz}
            topicId={topicId}
          />
        )}

        {/* Module CRUD Modal */}
        <ModuleModal
          isOpen={moduleModalOpen}
          onClose={() => setModuleModalOpen(false)}
          moduleForm={moduleForm}
          setModuleForm={setModuleForm}
          editingModuleId={editingModuleId}
          saveModule={saveModule}
          saving={saving}
        />

        {/* Subject CRUD Modal */}
        <SubjectModal
          isOpen={subjectModalOpen}
          onClose={() => setSubjectModalOpen(false)}
          subjectForm={subjectForm}
          setSubjectForm={setSubjectForm}
          editingSubjectKey={editingSubjectKey}
          saveSubject={saveSubject}
          saving={saving}
          modules={modules}
        />

        {/* Topic CRUD Modal */}
        <TopicModal
          isOpen={topicModalOpen}
          onClose={() => setTopicModalOpen(false)}
          topicInitialForm={topicInitialForm}
          setTopicInitialForm={setTopicInitialForm}
          handleCreateTopic={handleCreateTopic}
          saving={saving}
        />
      </div>
    </AdminLayout>
  );
};
