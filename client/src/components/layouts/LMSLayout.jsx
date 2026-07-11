import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  Outlet,
  useParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { topicsContent } from "../../assets/data/topicsContent";
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

// Syllabus structure grouped by course modules
const coursesConfig = {
  react: {
    title: "React",
    topics: [
      {
        path: "/introduction",
        title: "01. Introduction",
        id: "01-introduction",
      },
      { path: "/jsx", title: "02. JSX", id: "02-jsx" },
      { path: "/components", title: "03. Components", id: "03-components" },
      { path: "/props", title: "04. Props", id: "04-props" },
      { path: "/state", title: "05. State & useState", id: "05-state" },
      { path: "/events", title: "06. Events", id: "06-events" },
      { path: "/forms", title: "07. Forms & Inputs", id: "07-forms" },
      { path: "/useeffect", title: "08. useEffect Hook", id: "08-useeffect" },
      { path: "/useref", title: "09. useRef Hook", id: "09-useref" },
      { path: "/usememo", title: "10. useMemo Hook", id: "10-usememo" },
      {
        path: "/usecallback",
        title: "11. useCallback Hook",
        id: "11-usecallback",
      },
      { path: "/context-api", title: "12. Context API", id: "12-contextapi" },
      {
        path: "/react-router",
        title: "13. React Router",
        id: "13-reactrouter",
      },
      { path: "/api-calls", title: "14. API Fetching", id: "14-apicalls" },
      {
        path: "/custom-hooks",
        title: "15. Custom Hooks",
        id: "15-customhooks",
      },
    ],
  },
  javascript: {
    title: "JavaScript",
    topics: [
      {
        path: "/javascript/basics",
        title: "01. Variables & Types",
        id: "js-basics",
      },
      {
        path: "/javascript/functions",
        title: "02. Functions & Closures",
        id: "js-functions",
      },
      {
        path: "/javascript/arrays-objects",
        title: "03. Arrays & Objects",
        id: "js-arrays-objects",
      },
      {
        path: "/javascript/promises-async",
        title: "04. Promises & Async",
        id: "js-promises-async",
      },
    ],
  },
  node: {
    title: "Node.js",
    topics: [
      { path: "/node/intro", title: "01. Node Intro", id: "node-intro" },
      {
        path: "/node/modules",
        title: "02. CommonJS vs ESM",
        id: "node-modules",
      },
      {
        path: "/node/fs-module",
        title: "03. File System (fs)",
        id: "node-fs-module",
      },
      {
        path: "/node/http-module",
        title: "04. HTTP Server",
        id: "node-http-module",
      },
    ],
  },
  express: {
    title: "Express",
    topics: [
      {
        path: "/express/routing",
        title: "01. Routing Basics",
        id: "express-routing",
      },
      {
        path: "/express/middleware",
        title: "02. Middleware Concept",
        id: "express-middleware",
      },
      {
        path: "/express/controllers",
        title: "03. Controllers & MVC",
        id: "express-controllers",
      },
      {
        path: "/express/error-handling",
        title: "04. Error Handlers",
        id: "express-error-handling",
      },
    ],
  },
  mongodb: {
    title: "MongoDB",
    topics: [
      {
        path: "/mongodb/nosql-basics",
        title: "01. NoSQL Basics",
        id: "mongodb-basics",
      },
    ],
  },
  mongoose: {
    title: "Mongoose",
    topics: [
      {
        path: "/mongoose/schemas-models",
        title: "01. Schemas & Models",
        id: "mongoose-schemas",
      },
    ],
  },
  authentation: {
    title: "Authentication",
    topics: [
      {
        path: "/authentation/jwt",
        title: "01. JWT & Sessions",
        id: "auth-jwt",
      },
    ],
  },
};

const defaultSubjects = [
  {
    key: "javascript",
    title: "JavaScript Basics",
    icon: "IoLogoJavascript",
    iconColor: "text-yellow-500",
  },
  {
    key: "react",
    title: "React Masterclass",
    icon: "FaReact",
    iconColor: "text-blue-500",
  },
  {
    key: "node",
    title: "Node.js Server",
    icon: "FaNodeJs",
    iconColor: "text-green-500",
  },
  {
    key: "express",
    title: "Express API Framework",
    icon: "SiExpress",
    iconColor: "text-purple-500",
  },
  {
    key: "mongodb",
    title: "MongoDB NoSQL",
    icon: "SiMongodb",
    iconColor: "text-emerald-600",
  },
  {
    key: "mongoose",
    title: "Mongoose ODM",
    icon: "SiMongoosedotws",
    iconColor: "text-orange-500",
  },
  {
    key: "authentation",
    title: "Auth & Session JWT",
    icon: "FaShieldAlt",
    iconColor: "text-gray-500",
  },
];

const LMSLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dbModules, setDbModules] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbTopics, setDbTopics] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);

  const {
    moduleKey,
    subjectKey: rawSubjectKey,
    "*": rawTopicWildcard,
  } = useParams();

  // Resolve actual subject key and topic ID based on whether moduleKey matches a subject
  const isSubject = (dbSubjects.length > 0 ? dbSubjects : defaultSubjects).some(
    (s) => s.key === moduleKey,
  );
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

  // Dark/Light Mode state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  // Track completed topics
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem("completedTopics");
    return saved ? JSON.parse(saved) : [];
  });

  // Active Tab for learning content
  const [activeTab, setActiveTab] = useState("learn");

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
        const [{ data: mods }, { data: subs }, { data: tops }] =
          await Promise.all([
            cmsService.getModules(),
            cmsService.getSubjects(),
            cmsService.getTopics(),
          ]);
        setDbModules(mods);
        setDbSubjects(subs);
        setDbTopics(tops);
      } catch (err) {
        console.error("Failed to load CMS data, using fallback:", err);
      }
    };
    fetchSyllabus();
  }, []);

  // Fetch backend data if logged in, otherwise load from localStorage
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
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
  ) => {
    if (!user) {
      alert("Please log in to submit tasks for evaluation.");
      return false;
    }
    setSaveStatus("Submitting...");
    try {
      const { data } = await submissionService.submit(
        topicPath,
        sectionIndex,
        submissionType,
        contentText,
      );

      setMySubmissions((prev) => {
        const filtered = prev.filter(
          (s) => !(s.topicId === topicPath && s.sectionIndex === sectionIndex),
        );
        return [...filtered, data];
      });

      setSaveStatus("Task submitted!");
      setTimeout(() => setSaveStatus(""), 2000);
      return true;
    } catch (error) {
      console.error(error);
      setSaveStatus("Submission failed");
      alert(error.response?.data?.message || error.message);
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
    // Fallback prefixes
    if (currentPath.startsWith("/javascript")) return "javascript";
    if (currentPath.startsWith("/node")) return "node";
    if (currentPath.startsWith("/express")) return "express";
    if (currentPath.startsWith("/mongodb")) return "mongodb";
    if (currentPath.startsWith("/mongoose")) return "mongoose";
    if (currentPath.startsWith("/authentation")) return "authentation";
    return "react"; // Default fallback
  };

  const getDynamicSyllabus = () => {
    if (dbSubjects.length === 0 || dbTopics.length === 0) {
      return coursesConfig;
    }
    const config = {};
    dbSubjects.forEach((subj) => {
      const mod = dbModules.find(
        (m) => m._id === subj.module?._id || m._id === subj.module,
      );
      const modKey =
        mod?.path && mod.path !== "/" ? mod.path.replace(/^\//, "") : "";

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

  // Auto-redirect to first topic if accessing subject root
  useEffect(() => {
    if (subjectKey && !topicWildcard && dynamicCoursesConfig[subjectKey]) {
      const firstTopic = dynamicCoursesConfig[subjectKey]?.topics[0];
      if (firstTopic) {
        navigate(firstTopic.path, { replace: true });
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

  // Verify if active route belongs to any topic
  const isTopicPage = Object.values(dynamicCoursesConfig).some((c) =>
    c.topics.some((t) => t.path === currentPath),
  );

  const getActiveTopic = () => {
    const dbTopic = dbTopics.find((t) => t.topicId === topicPath);
    if (dbTopic) return dbTopic;
    return topicsContent[topicPath];
  };

  const activeTopic = getActiveTopic();

  return (
    <div className="h-screen w-screen overflow-hidden bg-base-100 text-base-content flex flex-col font-sans transition-colors duration-300">
      {/* Premium Sticky Header */}
      <Header saveStatus={saveStatus} theme={theme} toggleTheme={toggleTheme} />

      {/* Main LMS Dashboard Container */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation - Full width on mobile if no topic, else hidden on mobile */}
        {isTopicPage && (
          <Sidebar
            activeCourseKey={activeCourseKey}
            handleCourseChange={handleCourseChange}
            topicsList={topicsList}
            currentPath={currentPath}
            isTopicPage={isTopicPage}
            subjectsList={dbSubjects.length > 0 ? dbSubjects : defaultSubjects}
            modulesList={dbModules}
            className={`flex flex-col shrink-0 h-full min-h-0 bg-base-200 border-r border-base-300 z-10 transition-all duration-300 ${activeTopic ? "hidden lg:flex lg:w-80" : "flex w-full lg:w-80"}`}
          />
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
                    <div className="p-4 bg-info/10 text-info border border-info/20 rounded-2xl flex gap-3 items-center">
                      <span className="text-2xl">⚡</span>
                      <div className="text-sm">
                        <span className="font-bold">Interactive Sandbox:</span>{" "}
                        Below is a live instance of the topic component.
                        Interact with it directly to observe how states change
                        and render.
                      </div>
                    </div>

                    <Sandbox defaultCode={activeTopic.syntax} theme={theme} />
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
