import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { topicsContent } from "../../data/topicsContent";
import Header from "../ui/Header";
import Sidebar from "../ui/Sidebar";
import InteractiveSandbox from "../InteractiveSandbox";
import LearnTab from "../LearnTab";
import PracticeTab from "../PracticeTab";
import NotebookTab from "../NotebookTab";
import BottomNavigation from "../ui/BottomNavigation";
import { useSidebarStore } from "../../store/useSidebarStore";

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

const LMSLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { isOpen, closeSidebar } = useSidebarStore();

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

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync completion to storage
  useEffect(() => {
    localStorage.setItem("completedTopics", JSON.stringify(completedTopics));
  }, [completedTopics]);

  // Keep tab in sync or reset to learn on topic change
  useEffect(() => {
    setActiveTab("learn");
  }, [currentPath]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Determine active course key based on URL path prefix
  const getActiveCourseKey = () => {
    if (currentPath.startsWith("/javascript")) return "javascript";
    if (currentPath.startsWith("/node")) return "node";
    if (currentPath.startsWith("/express")) return "express";
    if (currentPath.startsWith("/mongodb")) return "mongodb";
    if (currentPath.startsWith("/mongoose")) return "mongoose";
    if (currentPath.startsWith("/authentation")) return "authentation";
    return "react"; // Default fallback
  };

  const activeCourseKey = getActiveCourseKey();
  const activeCourse = coursesConfig[activeCourseKey];
  const topicsList = activeCourse.topics;

  const handleCourseChange = (courseKey) => {
    const firstTopic = coursesConfig[courseKey].topics[0];
    if (firstTopic) {
      navigate(firstTopic.path);
    }
  };

  const handleTopicCompleteToggle = (path) => {
    if (completedTopics.includes(path)) {
      setCompletedTopics((prev) => prev.filter((p) => p !== path));
    } else {
      setCompletedTopics((prev) => [...prev, path]);
    }
  };

  const handleNoteChange = (text) => {
    setSaveStatus("Saving...");
    const updatedNotes = { ...notes, [currentPath]: text };
    setNotes(updatedNotes);
    localStorage.setItem("lms_notes", JSON.stringify(updatedNotes));
    setTimeout(() => setSaveStatus("All changes saved"), 600);
  };

  const handleAnswerChange = (questionIndex, text) => {
    setSaveStatus("Saving...");
    const key = `${currentPath}_${questionIndex}`;
    const updatedAnswers = { ...exerciseAnswers, [key]: text };
    setExerciseAnswers(updatedAnswers);
    localStorage.setItem("lms_answers", JSON.stringify(updatedAnswers));
    setTimeout(() => setSaveStatus("All changes saved"), 600);
  };

  // Verify if active route belongs to any topic
  const isTopicPage = Object.values(coursesConfig).some((c) =>
    c.topics.some((t) => t.path === currentPath),
  );

  const activeTopic = topicsContent[currentPath];

  return (
    <div className="h-screen w-screen overflow-hidden bg-base-100 text-base-content flex flex-col font-sans transition-colors duration-300">
      {/* Mobile Slider Sidebar */}
      <AnimatePresence>
        {isOpen && isTopicPage && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-40 bg-neutral-950/80 lg:hidden"
            />
            {/* Sliding Drawer container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-base-200 border-r border-base-300 lg:hidden flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-base-300 bg-base-200 shrink-0">
                <span className="text-sm font-black text-primary">
                  Syllabus Menu
                </span>
                <button
                  onClick={closeSidebar}
                  className="btn btn-sm btn-circle btn-ghost border border-base-300 bg-base-100 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeCourseKey={activeCourseKey}
                  handleCourseChange={handleCourseChange}
                  topicsList={topicsList}
                  currentPath={currentPath}
                  className="flex w-full border-none shadow-none"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Sticky Header */}
      <Header saveStatus={saveStatus} theme={theme} toggleTheme={toggleTheme} />

      {/* Main LMS Dashboard Container */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation - only visible on topic pages */}
        {isTopicPage && (
          <Sidebar
            activeCourseKey={activeCourseKey}
            handleCourseChange={handleCourseChange}
            topicsList={topicsList}
            currentPath={currentPath}
          />
        )}

        {/* Content Workspace - Independently Scrolling */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-base-100 h-full">
          {isTopicPage && activeTopic ? (
            <div className="p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
              {/* Breadcrumbs & Header Details */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <Link to="/" className="hover:text-primary">
                    MERN Stack
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
                  <LearnTab activeTopic={activeTopic} />
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

                    <InteractiveSandbox
                      defaultCode={activeTopic.syntax}
                      theme={theme}
                    />
                  </div>
                )}

                {/* 3. PRACTICE TAB */}
                {activeTab === "practice" && (
                  <PracticeTab
                    activeTopic={activeTopic}
                    exerciseAnswers={exerciseAnswers}
                    currentPath={currentPath}
                    handleAnswerChange={handleAnswerChange}
                  />
                )}

                {/* 4. NOTEBOOK TAB */}
                {activeTab === "notes" && (
                  <NotebookTab
                    notes={notes}
                    currentPath={currentPath}
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
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default LMSLayout;
