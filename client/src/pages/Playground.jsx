import React, { useState, useEffect } from "react";
import InteractiveSandbox from "../components/InteractiveSandbox";

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

const Playground = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [lang, setLang] = useState("react");

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

  const defaultCode = lang === "react" ? defaultReactCode : defaultJSCode;

  return (
    <div className="px-2 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fadeIn">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="select select-sm select-bordered rounded-xl bg-base-100 font-bold focus:border-primary text-xs  w-fit ml-auto"
        >
          <option value="react">React Sandbox</option>
          <option value="javascript">JavaScript Console</option>
        </select>

      <div className="w-full">
        <InteractiveSandbox defaultCode={defaultCode} theme={theme} />
      </div>
    </div>
  );
};

export default Playground;
