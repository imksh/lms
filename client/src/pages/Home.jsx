import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveSandbox from "../components/InteractiveSandbox";
import { RichTextEditor } from "@imksh/editor";
import "@imksh/editor/style.css";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact, FaNodeJs, FaShieldAlt } from "react-icons/fa";
import { SiExpress, SiMongodb, SiMongoosedotws } from "react-icons/si";

const subjects = [
  {
    title: "JavaScript Basics",
    icon: IoLogoJavascript,
    desc: "Master variables, ES6 features, arrays, objects, promises, and async/await.",
    path: "/javascript/basics",
    color: "border-yellow-500/30 hover:border-yellow-500 bg-yellow-500/5",
    iconColor: "text-yellow-500",
  },
  {
    title: "React Masterclass",
    icon: FaReact,
    desc: "Build reactive UIs using JSX, components, props, state, effects, context, and custom hooks.",
    path: "/introduction",
    color: "border-blue-500/30 hover:border-blue-500 bg-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    title: "Node.js Server",
    icon: FaNodeJs,
    desc: "Understand the runtime, modules, event loop, fs operations, and HTTP servers.",
    path: "/node/intro",
    color: "border-green-500/30 hover:border-green-500 bg-green-500/5",
    iconColor: "text-green-500",
  },
  {
    title: "Express API Framework",
    icon: SiExpress,
    desc: "Learn routing, middlewares, MVC structure, and global error handling.",
    path: "/express/routing",
    color: "border-purple-500/30 hover:border-purple-500 bg-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    title: "MongoDB Database",
    icon: SiMongodb,
    desc: "Work with flexible collections, documents, and understand BSON basics.",
    path: "/mongodb/nosql-basics",
    color: "border-emerald-600/30 hover:border-emerald-600 bg-emerald-600/5",
    iconColor: "text-emerald-600",
  },
  {
    title: "Mongoose ODM",
    icon: SiMongoosedotws,
    desc: "Design strict schemas, validation constraints, and database query methods.",
    iconColor: "text-emerald-600",
    path: "/mongoose/schemas-models",
    color: "border-orange-500/30 hover:border-orange-500 bg-orange-500/5",
  },
  {
    title: "JWT Authentication",
    icon: FaShieldAlt,
    desc: "Secure routes with JSON Web Tokens, stateful/stateless sessions, and middleware.",
    path: "/authentation/jwt",
    iconColor: "text-gray-500",
    color: "border-gray-500/30 hover:border-gray-500 bg-gray-500/5",
  },
];

const defaultReactCode = `import React from "react";

function App() {
  return (
    <div className="flex justify-center item-center h-full w-full">
      Code here...
    </div>
  );
}`;

const defaultJSCode = `// JavaScript Playground

console.log("Code here...");
`;
const Home = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [lang, setLang] = useState("react");
  const sandboxRef = useRef(null);

  // Keep theme state updated with document attribute changes (from Header toggle)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSandbox = () => {
    sandboxRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const defaultCode = lang === "react" ? defaultReactCode : defaultJSCode;

  return (
    <div className="px-4 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-primary/10 via-base-200 to-accent/5 p-8 md:p-10 border border-base-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            MERN Stack
          </h2>
          <p className="text-base-content/75 text-sm md:text-base leading-relaxed">
            Select a subject to begin learning. Each course offers explanations,
            live interactive components, practice questions, and study notes.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          <button
            onClick={scrollToSandbox}
            className="btn btn-primary rounded-2xl w-full md:w-auto px-6 font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            ⚡ Try Playground
          </button>
        </div>
      </section>

      {/* Grid of Courses */}
      <div className="flex flex-col gap-6 ">
        <h3 className="hidden md:flex text-xl font-bold border-b border-base-300 pb-3 items-center gap-2">
          <span>📚</span> Choose a Subject
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subj) => {
            const Icon = subj.icon;

            return (
              <div
                key={subj.title}
                className={`card border ${subj.color} hover:-translate-y-1 hover:shadow-md transition-all duration-300 group rounded-2xl overflow-hidden cursor-pointer`}
                onClick={() => navigate(subj.path)}
              >
                <div className="card-body p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl p-2 bg-base-100 rounded-xl shadow-inner border border-base-300/40 w-fit">
                      <Icon className={subj.iconColor} />
                    </span>

                    <h4 className="text-base font-extrabold group-hover:text-primary transition-colors mt-2">
                      {subj.title}
                    </h4>

                    <p className="text-xs text-base-content/70 leading-relaxed min-h-[48px]">
                      {subj.desc}
                    </p>
                  </div>

                  <div className="card-actions">
                    <span className="text-xs font-black text-primary group-hover:translate-x-1 transition-transform">
                      Start Course →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playground Area on Home Page */}
      <div ref={sandboxRef} className="flex flex-col gap-6 mt-4">
        <div className="flex items-center justify-between border-b border-base-300 pb-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            Playground
          </h3>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="select select-sm w-fit select-bordered rounded-xl bg-base-100 font-bold focus:border-primary text-xs"
          >
            <option value="react">React Sandbox</option>
            <option value="javascript">JavaScript Console</option>
          </select>
        </div>
        <InteractiveSandbox defaultCode={defaultCode} theme={theme} />
      </div>
      <div className="flex border-b border-base-300 pb-3 mt-8">
        <h3 className="text-xl font-bold flex items-center gap-2">Notebook</h3>
      </div>
      <div className="w-full">
        <RichTextEditor
          value={content}
          placeholder="Start writing..."
          onChange={setContent}
          height={350}
        />
      </div>
    </div>
  );
};

export default Home;
