import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  Outlet,
  useParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Header from "../ui/Header";
import Sidebar from "../ui/Sidebar";
import Sandbox from "../student/Sandbox";
import LearnTab from "../student/LearnTab";
import PracticeTab from "../student/PracticeTab";
import NotebookTab from "../student/NotebookTab";
import BottomNavigation from "../ui/BottomNavigation";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useAuthStore } from "../../store/useAuthStore";
import { cmsService } from "../../services/cmsService";
import { userDataService } from "../../services/userDataService";
import { submissionService } from "../../services/submissionService";
import { useCacheStore } from "../../stores/useCacheStore";
import Loading from "../Loading";

const LMSLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dbModules, setDbModules] = useState([]);
  const [loading, setLoading] = useState({
    modules: true,
    subjects: true,
    topics: true,
  });

  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbTopics, setDbTopics] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const {
    moduleKey,
    subjectKey: rawSubjectKey,
    "*": rawTopicWildcard,
  } = useParams();

  // Resolve actual subject key and topic ID based on whether moduleKey matches a subject
  const isSubject = dbSubjects.some((s) => s.key === moduleKey);
  const subjectKey = isSubject ? moduleKey : rawSubjectKey;
  const topicWildcard = isSubject
    ? rawSubjectKey + (rawTopicWildcard ? "/" + rawTopicWildcard : "")
    : rawTopicWildcard;

  // If there's a subject and topicWildcard, we construct the topicId (e.g. "/introduction")
  // For backwards compatibility or root routes, we fallback to location.pathname
  const currentPath = location.pathname;
  const topicPath = topicWildcard
    ? topicWildcard.startsWith("/")
      ? topicWildcard
      : "/" + topicWildcard
    : currentPath;

  const { isOpen, closeSidebar, openSidebar } = useSidebarStore();

  // Auto-close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [currentPath]);

  // Track completed topics
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem("completedTopics");
    return saved ? JSON.parse(saved) : [];
  });

  // Active Tab for learning content
  const [activeTab, setActiveTab] = useState("learn");

  // Desktop Sidebar Toggle
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    return localStorage.getItem("desktopSidebarOpen") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("desktopSidebarOpen", isDesktopSidebarOpen);
  }, [isDesktopSidebarOpen]);

  // Notepad State
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("lms_notes");
    return saved ? JSON.parse(saved) : {};
  });

  // Exercise Answers state
  const [exerciseAnswers, setExerciseAnswers] = useState(() => {
    const saved = localStorage.getItem("lms_answers");
    return saved ? JSON.parse(saved) : {};
  });

  const [saveStatus, setSaveStatus] = useState("");
  const { user } = useAuthStore();

  // Fetch CMS subjects and topics from database
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading((prev) => ({ ...prev, syllabus: true }));
        const state = useCacheStore.getState();

        let mods = state.modules;
        let subs = state.subjects;
        let tops = state.allTopics;

        const promises = [];
        if (!mods)
          promises.push(
            cmsService.getModules().then((res) => {
              mods = res.data;
              useCacheStore.getState().setModules(mods);
            }),
          );
        if (!subs)
          promises.push(
            cmsService.getSubjects().then((res) => {
              subs = res.data;
              useCacheStore.getState().setSubjects(subs);
            }),
          );
        if (!tops)
          promises.push(
            cmsService.getTopics().then((res) => {
              tops = res.data;
              useCacheStore.getState().setAllTopics(tops);
            }),
          );

        if (promises.length > 0) {
          await Promise.all(promises);
        }

        setDbModules(mods || []);
        setDbSubjects(subs || []);
        setDbTopics(tops || []);
      } catch (err) {
        console.error("Failed to load CMS data, using fallback:", err);
      } finally {
        setLoading((prev) => ({ ...prev, syllabus: false }));
      }
    };
    fetchSyllabus();
  }, []);

  // Fetch backend data if logged in, otherwise load from localStorage
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          setLoading((prev) => ({ ...prev, userData: true }));
          setSaveStatus("Syncing...");

          // Fetch notes
          const { data: notesList } = await userDataService.getNotes();
          const notesMap = {};
          notesList.forEach((n) => {
            notesMap[n.topicId] = n.content;
          });
          setNotes(notesMap);

          // Fetch progress
          const { data: progressList } = await userDataService.getProgress();
          setCompletedTopics(progressList);

          // Fetch answers
          const { data: answersList } = await userDataService.getAnswers();
          const answersMap = {};
          answersList.forEach((a) => {
            answersMap[`${a.topicId}_${a.questionIndex}`] = a.code;
          });
          setExerciseAnswers(answersMap);

          // Fetch submissions
          const { data: subsData } = await submissionService.getMySubmissions();
          setMySubmissions(subsData);

          setSaveStatus("Synced with cloud");
          setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
          console.error("Sync error:", error);
          setSaveStatus("Failed to sync");
        } finally {
          setLoading((prev) => ({ ...prev, userData: false }));
        }
      } else {
        // Logged out, reload local states
        const savedTopics = localStorage.getItem("completedTopics");
        setCompletedTopics(savedTopics ? JSON.parse(savedTopics) : []);

        const savedNotes = localStorage.getItem("lms_notes");
        setNotes(savedNotes ? JSON.parse(savedNotes) : {});

        const savedAnswers = localStorage.getItem("lms_answers");
        setExerciseAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});

        setMySubmissions([]);
      }
    };

    loadUserData();
  }, [user]);

  const handleTaskSubmit = async (
    sectionIndex,
    submissionType,
    contentText,
    targetTopicId = null,
  ) => {
    if (!user) {
      toast.error("Please log in to submit tasks for evaluation.");
      return false;
    }
    const finalTopicId = targetTopicId || topicPath;
    setSaveStatus("Submitting...");
    try {
      const { data } = await submissionService.submit(
        finalTopicId,
        sectionIndex,
        submissionType,
        contentText,
      );

      setMySubmissions((prev) => {
        const filtered = prev.filter(
          (s) =>
            !(s.topicId === finalTopicId && s.sectionIndex === sectionIndex),
        );
        return [...filtered, data];
      });

      setSaveStatus("Task submitted!");
      setTimeout(() => setSaveStatus(""), 2000);
      toast.success("Task submitted successfully!");
      return true;
    } catch (error) {
      console.error(error);
      setSaveStatus("Submission failed");
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Keep tab in sync or reset to learn on topic change
  useEffect(() => {
    setActiveTab("learn");
  }, [currentPath]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Determine active course key based on URL path prefix
  const getActiveCourseKey = () => {
    if (subjectKey) return subjectKey;
    if (dbSubjects.length > 0 && dbTopics.length > 0) {
      const activeTopicItem = dbTopics.find((t) => t.topicId === currentPath);
      if (activeTopicItem) return activeTopicItem.subjectKey;
    }
    return "react"; // Default fallback
  };

  const getDynamicSyllabus = () => {
    if (dbSubjects.length === 0 || dbTopics.length === 0) {
      return {};
    }
    const config = {};
    dbSubjects.forEach((subj) => {
      const mod =
        dbModules.find(
          (m) => m._id === subj.module?._id || m._id === subj.module,
        ) || subj.module;

      let modKey = "default";
      if (mod) {
        if (mod.path && mod.path !== "/") {
          modKey = mod.path.replace(/^\//, "");
        } else if (mod._id) {
          modKey = mod._id;
        } else if (typeof mod === "string") {
          modKey = mod;
        }
      }

      config[subj.key] = {
        title: subj.title,
        topics: dbTopics
          .filter((t) => t.subjectKey === subj.key)
          .map((t) => {
            const tId = t.topicId.startsWith("/") ? t.topicId : "/" + t.topicId;
            const pathParts = [modKey, subj.key, tId.replace(/^\//, "")].filter(
              Boolean,
            );
            return {
              path: "/" + pathParts.join("/"),
              title: t.title,
              id: tId.replace(/\//g, "-"),
            };
          }),
      };
    });
    return config;
  };

  const dynamicCoursesConfig = getDynamicSyllabus();
  const activeCourseKey = getActiveCourseKey();
  const activeCourse = dynamicCoursesConfig[activeCourseKey] || {
    title: "",
    topics: [],
  };
  const topicsList = activeCourse.topics;

  // Auto-redirect to first topic if accessing subject root (Desktop only)
  useEffect(() => {
    if (subjectKey && !topicWildcard && dynamicCoursesConfig[subjectKey]) {
      // Only auto-redirect on larger screens so mobile users see the topics list first
      if (window.innerWidth >= 1024) {
        const firstTopic = dynamicCoursesConfig[subjectKey]?.topics[0];
        if (firstTopic) {
          navigate(firstTopic.path, { replace: true });
        }
      }
    }
  }, [subjectKey, topicWildcard, dynamicCoursesConfig, navigate]);

  const handleCourseChange = (courseKey) => {
    const firstTopic = dynamicCoursesConfig[courseKey]?.topics[0];
    if (firstTopic) {
      navigate(firstTopic.path);
    }
  };

  const handleTopicCompleteToggle = async (path) => {
    const isCompleted = completedTopics.includes(path);
    const updatedTopics = isCompleted
      ? completedTopics.filter((p) => p !== path)
      : [...completedTopics, path];

    setCompletedTopics(updatedTopics);
    localStorage.setItem("completedTopics", JSON.stringify(updatedTopics));

    if (user) {
      try {
        setSaveStatus("Saving...");
        await userDataService.toggleProgress(path);
        setSaveStatus("All changes saved");
      } catch (error) {
        console.error(error);
        setSaveStatus("Offline - saved locally");
      }
    }
  };

  const handleNoteChange = async (text) => {
    setSaveStatus("Saving...");
    const updatedNotes = { ...notes, [topicPath]: text };
    setNotes(updatedNotes);
    localStorage.setItem("lms_notes", JSON.stringify(updatedNotes));

    if (user) {
      try {
        await userDataService.saveNote(topicPath, text);
        setSaveStatus("All changes saved");
      } catch (error) {
        console.error(error);
        setSaveStatus("Offline - saved locally");
      }
    } else {
      setTimeout(() => setSaveStatus("All changes saved"), 600);
    }
  };

  const handleAnswerChange = async (questionIndex, text) => {
    setSaveStatus("Saving...");
    const key = `${topicPath}_${questionIndex}`;
    const updatedAnswers = { ...exerciseAnswers, [key]: text };
    setExerciseAnswers(updatedAnswers);
    localStorage.setItem("lms_answers", JSON.stringify(updatedAnswers));

    if (user) {
      try {
        await userDataService.saveAnswer(topicPath, questionIndex, text);
        setSaveStatus("All changes saved");
      } catch (error) {
        console.error(error);
        setSaveStatus("Offline - saved locally");
      }
    } else {
      setTimeout(() => setSaveStatus("All changes saved"), 600);
    }
  };

  const getActiveTopic = () => {
    const dbTopic = dbTopics.find((t) => {
      const dbId = t.topicId.replace(/^\//, "");
      const pathId = decodeURIComponent(topicPath).replace(/^\//, "");
      // Ensure the topic belongs to the correct subject if subjectKey is present
      const matchesSubject = subjectKey ? t.subjectKey === subjectKey : true;
      return dbId === pathId && matchesSubject;
    });
    return dbTopic;
  };

  const activeTopic = getActiveTopic();

  // Verify if active route belongs to any topic
  const isTopicPage =
    !!activeTopic ||
    Object.values(dynamicCoursesConfig).some((c) =>
      c.topics.some(
        (t) =>
          t.path === decodeURIComponent(currentPath) || t.path === currentPath,
      ),
    );

  if (loading.syllabus || loading.userData) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-base-100 text-base-content flex flex-col font-sans transition-colors duration-300">
      {/* Premium Sticky Header */}
      <Header saveStatus={saveStatus} theme={theme} toggleTheme={toggleTheme} />

      {/* Main LMS Dashboard Container */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] relative">
        {/* Mobile Sidebar Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-base-300/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar Navigation - Full width on mobile if no topic, else hidden on mobile unless toggled */}
        {isTopicPage && (
          <Sidebar
            activeCourseKey={activeCourseKey}
            handleCourseChange={handleCourseChange}
            topicsList={topicsList}
            currentPath={currentPath}
            isTopicPage={isTopicPage}
            subjectsList={dbSubjects}
            modulesList={dbModules}
            className={`flex flex-col shrink-0 h-full min-h-0 bg-base-200 border-base-300 transition-all duration-300 ${
              isOpen
                ? "fixed lg:static inset-y-0 left-0 z-50 w-80 shadow-2xl lg:shadow-none flex border-r"
                : activeTopic
                  ? `hidden lg:flex z-10 ${isDesktopSidebarOpen ? "w-80 border-r opacity-100" : "w-0 overflow-hidden border-none opacity-0"}`
                  : `flex w-full z-10 ${isDesktopSidebarOpen ? "lg:w-80 border-r lg:opacity-100" : "lg:w-0 lg:overflow-hidden lg:border-none lg:opacity-0"}`
            }`}
          />
        )}

        {/* Desktop Sidebar Toggle Button */}
        {isTopicPage && (
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden lg:flex absolute z-50 top-4 btn btn-circle btn-sm bg-base-100 border border-base-300 shadow-md text-base-content hover:bg-base-200 transition-all duration-300"
            style={{
              left: isDesktopSidebarOpen ? "calc(20rem - 1rem)" : "1rem",
            }}
            title={isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isDesktopSidebarOpen ? (
              <PanelLeftClose size={16} />
            ) : (
              <PanelLeftOpen size={16} />
            )}
          </button>
        )}

        {/* Content Workspace - Independently Scrolling */}
        <main
          className={`flex-1 overflow-y-auto bg-base-100 h-full min-h-0 transition-all duration-300 ${isTopicPage && !activeTopic ? "hidden lg:flex flex-col" : "flex flex-col"}`}
        >
          {isTopicPage && activeTopic ? (
            <div className="px-4 py-6 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
              {/* Breadcrumbs & Header Details */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-base-content/60 flex-wrap">
                  <Link
                    to={`/${moduleKey || "default"}/${subjectKey || "default"}`}
                    className="flex lg:hidden items-center gap-1 font-bold text-primary mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Syllabus
                  </Link>
                  <Link to="/" className="hover:text-primary">
                    LMS
                  </Link>
                  <span>/</span>
                  <span className="text-base-content font-medium">
                    {activeCourse.title}
                  </span>
                  <span>/</span>
                  <span className="text-base-content font-medium">
                    {activeTopic.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    {activeTopic.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-primary badge-outline font-semibold px-3 py-2.5 text-xs">
                      ⚡ {activeTopic.difficulty}
                    </span>
                    <span className="badge badge-primary badge-soft font-semibold px-3 py-2.5 text-xs">
                      ⏱️ {activeTopic.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* LMS Tabs */}
              <div className="w-full flex justify-center items-center sticky md:static top-0 z-20 bg-base-100 py-2 md:py-0">
                <div className="tabs  mx-auto tabs-box bg-base-200 p-1 rounded-2xl w-fit flex gap-1 border border-base-300">
                  <button
                    onClick={() => setActiveTab("learn")}
                    className={`tab tab-sm rounded-xl px-4 md:px-5 text-sm md:text-base font-bold transition-all  ${
                      activeTab === "learn"
                        ? "tab-active bg-primary text-primary-content!"
                        : ""
                    }`}
                  >
                    Learn
                  </button>
                  {activeTopic.playgroundEnabled && (
                    <button
                      onClick={() => setActiveTab("demo")}
                      className={`tab tab-sm rounded-xl px-4 md:px-5 text-sm md:text-base font-bold transition-all ${
                        activeTab === "demo"
                          ? "tab-active bg-primary text-primary-content!"
                          : ""
                      }`}
                    >
                      Playground
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab("practice")}
                    className={`tab tab-sm rounded-xl px-4 md:px-5 text-sm md:text-base font-bold transition-all ${
                      activeTab === "practice"
                        ? "tab-active bg-primary text-primary-content!"
                        : ""
                    }`}
                  >
                    Practice
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`tab tab-sm rounded-xl px-4 md:px-5 text-sm md:text-base font-bold transition-all ${
                      activeTab === "notes"
                        ? "tab-active bg-primary text-primary-content!"
                        : ""
                    }`}
                  >
                    <span className="hidden md:flex">Notebook</span>{" "}
                    <span className="flex md:hidden">Note</span>
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 mt-2">
                {/* 1. LEARN TAB */}
                {activeTab === "learn" && (
                  <LearnTab
                    activeTopic={activeTopic}
                    mySubmissions={mySubmissions}
                    handleTaskSubmit={handleTaskSubmit}
                    theme={theme}
                  />
                )}

                {/* 2. LIVE DEMO TAB */}
                {activeTab === "demo" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <Sandbox
                      defaultCode={activeTopic.playgroundCode}
                      theme={theme}
                    />
                  </div>
                )}

                {/* 3. PRACTICE TAB */}
                {activeTab === "practice" && (
                  <PracticeTab
                    activeTopic={activeTopic}
                    exerciseAnswers={exerciseAnswers}
                    currentPath={topicPath}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* 4. NOTEBOOK TAB */}
                {activeTab === "notes" && (
                  <NotebookTab
                    notes={notes}
                    currentPath={topicPath}
                    handleNoteChange={handleNoteChange}
                  />
                )}
              </div>

              {/* Bottom Navigation */}
              <BottomNavigation
                topicsList={topicsList}
                currentPath={currentPath}
              />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default LMSLayout;
