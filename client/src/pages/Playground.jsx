import React, { useState, useEffect } from "react";
import InteractiveSandbox from "../components/InteractiveSandbox";

const defaultReactCode = `// Welcome to the Playground Sandbox!
// You can build React components.
// Click "Run Code" to execute.

function App() {
  const [likes, setLikes] = React.useState(0);
  const [text, setText] = React.useState("React Sandbox!");

  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border border-base-300 rounded-3xl">
      <div className="flex items-center gap-3">
        <span className="text-4xl animate-pulse">🚀</span>
        <div>
          <h2 className="text-xl font-black text-primary">
            {text}
          </h2>
          <p className="text-xs text-base-content/60">Edit code on the left to see changes live!</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className="input input-sm input-bordered w-full rounded-xl focus:border-primary text-xs px-4" 
          placeholder="Update title text..."
        />
        
        <button 
          onClick={() => setLikes(likes + 1)}
          className="btn btn-sm btn-primary w-full rounded-xl font-bold flex gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform"
        >
          ❤ Like this Sandbox ({likes})
        </button>
      </div>
    </div>
  );
}`;

const defaultJSCode = `// JavaScript Playground
// Write plain JavaScript and observe terminal outputs.
// Click "Run Code" to execute.

const students = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 82 },
  { name: "Charlie", score: 88 }
];

console.log("Analyzing student scores...");

// Calculate average score
const total = students.reduce((sum, s) => sum + s.score, 0);
const average = total / students.length;
console.log("Average Score:", average.toFixed(2));
`;

const Playground = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [lang, setLang] = useState("react");

  // Keep theme state updated with document attribute changes (from Header toggle)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => observer.disconnect();
  }, []);

  const defaultCode = lang === "react" ? defaultReactCode : defaultJSCode;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between border-b border-base-300 pb-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <span>⚡</span> Interactive Playground
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Write, format, and execute React components or JavaScript snippets in real-time.
          </p>
        </div>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)} 
          className="select select-sm select-bordered rounded-xl bg-base-100 font-bold focus:border-primary text-xs w-full md:w-auto mt-3 md:mt-0"
        >
          <option value="react">React Sandbox</option>
          <option value="javascript">JavaScript Console</option>
        </select>
      </div>

      <div className="w-full">
        <InteractiveSandbox defaultCode={defaultCode} theme={theme} />
      </div>
    </div>
  );
};

export default Playground;
