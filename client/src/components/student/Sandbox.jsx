import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Editor from "@monaco-editor/react";
import * as Babel from "@babel/standalone";
import {
  Maximize,
  Minimize,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const Sandbox = ({ defaultCode, language, theme, setData }) => {
  const [code, setCode] = useState(defaultCode || "");
  const [executedCode, setExecutedCode] = useState(defaultCode || "");
  const [error, setError] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isScriptMode, setIsScriptMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add("sandbox-fullscreen-active");
    } else {
      document.body.classList.remove("sandbox-fullscreen-active");
    }
    return () => document.body.classList.remove("sandbox-fullscreen-active");
  }, [isFullscreen]);

  const [showPreview, setShowPreview] = useState(true);
  const [panelSize, setPanelSize] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const startResizing = useCallback((eStart) => {
    eStart.preventDefault();
    setIsResizing(true);
    const isVertical = window.innerWidth < 1024;

    const handleMove = (eMove) => {
      if (!containerRef.current) return;
      const isTouch = eMove.type.startsWith('touch');
      const clientX = isTouch ? eMove.touches[0].clientX : eMove.clientX;
      const clientY = isTouch ? eMove.touches[0].clientY : eMove.clientY;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      let newSize;
      if (isVertical) {
        newSize = ((clientY - top) / height) * 100;
      } else {
        newSize = ((clientX - left) / width) * 100;
      }

      if (newSize >= 15 && newSize <= 85) {
        setPanelSize(newSize);
      }
    };

    const handleUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
  }, []);

  // States to pass transpiled code to the iframe
  const [sandboxCode, setSandboxCode] = useState("");
  const [sandboxComponentName, setSandboxComponentName] = useState("");

  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.trigger("keyboard", "editor.action.formatDocument");
    }
  };

  // Sync with defaultCode when topic changes
  useEffect(() => {
    setCode(defaultCode || "");
    setExecutedCode(defaultCode || "");
    setError(null);
    setSandboxCode("");
    setSandboxComponentName("");
  }, [defaultCode]);

  // Handle messages/errors from the sandbox iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "sandbox-error") {
        setError(event.data.message);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!executedCode.trim()) {
      setSandboxCode("");
      setSandboxComponentName("");
      setConsoleLogs([]);
      setError(null);
      return;
    }

    try {
      setError(null);
      setConsoleLogs([]);

      // Strip import statements
      const cleanCode = executedCode.replace(
        /import\s+[\s\S]*?from\s+['"].*?['"];?/g,
        "",
      );

      // Transpile JSX/ES6 to JS using Babel
      const compiled = Babel.transform(cleanCode, {
        presets: [["react", { runtime: "classic" }]],
      }).code;

      // Check if it's a React component vs a plain JS script
      const isBrowserEnv = language === "browser";
      const hasJSX =
        isBrowserEnv ||
        (cleanCode.includes("<") && cleanCode.includes(">")) ||
        compiled.includes("React.createElement");

      if (hasJSX) {
        setIsScriptMode(false);

        // Find component name
        let componentName = "";
        const exportDefaultMatch = compiled.match(/export\s+default\s+(\w+)/);
        if (exportDefaultMatch) {
          componentName = exportDefaultMatch[1];
        } else {
          const functionMatch = compiled.match(/function\s+(\w+)/);
          if (functionMatch) {
            componentName = functionMatch[1];
          } else {
            const constMatch = compiled.match(
              /(?:const|let|var)\s+(\w+)\s*=\s*(?:\(\s*\)|[^=>]+)\s*=>/,
            );
            if (constMatch) {
              componentName = constMatch[1];
            }
          }
        }

        let cleanCompiled = compiled
          .replace(/export\s+default\s+/g, "")
          .replace(/export\s+/g, "");

        // Fallback if no function component is defined, but code contains React.createElement calls
        if (!componentName && cleanCompiled.includes("React.createElement")) {
          cleanCompiled = `function DemoComponent() { return (${cleanCompiled.trim().replace(/;$/, "")}); }`;
          componentName = "DemoComponent";
        }

        if (!componentName) {
          throw new Error(
            "Could not find any component or function declaration in your React code. Please define a component (e.g. function App() { ... }).",
          );
        }

        setSandboxCode(cleanCompiled);
        setSandboxComponentName(componentName);
      } else {
        // Plain JS script mode
        setIsScriptMode(true);
        setSandboxCode("");
        setSandboxComponentName("");

        const logs = [];
        const customConsole = {
          log: (...args) => {
            logs.push({
              type: "log",
              text: args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg),
                )
                .join(" "),
            });
          },
          error: (...args) => {
            logs.push({
              type: "error",
              text: args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg),
                )
                .join(" "),
            });
          },
          warn: (...args) => {
            logs.push({
              type: "warn",
              text: args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg),
                )
                .join(" "),
            });
          },
          info: (...args) => {
            logs.push({
              type: "info",
              text: args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg),
                )
                .join(" "),
            });
          },
        };

        // Execute plain JS
        const runner = new Function("console", compiled);
        runner(customConsole);

        if (logs.length === 0) {
          logs.push({
            type: "info",
            text: "Code executed successfully with no console output. Try adding console.log() to print variables!",
          });
        }

        setConsoleLogs(logs);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    }
  }, [executedCode]);

  const handleRun = () => {
    setExecutedCode(code);
  };

  // Construct iframe document source dynamically
  const iframeSrcDoc = useMemo(() => {
    if (!sandboxCode || !sandboxComponentName) return "";

    return `
      <!DOCTYPE html>
      <html data-theme="${theme || "dark"}">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flyonui@2.4.1/flyonui.css">
          <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
          <style>
            body {
              background-color: transparent;
              margin: 0;
              padding: 1.5rem;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="sandbox-root"></div>
          <script>
            window.addEventListener('error', function(event) {
              window.parent.postMessage({ type: 'sandbox-error', message: event.message }, '*');
            });

            try {
              const { useState, useEffect, useRef, useMemo, useCallback } = React;
              
              // User compiled code
              ${sandboxCode}
              
              const mountNode = document.getElementById('sandbox-root');
              const root = ReactDOM.createRoot(mountNode);
              root.render(React.createElement(${sandboxComponentName}));
            } catch (err) {
              window.parent.postMessage({ type: 'sandbox-error', message: err.message }, '*');
            }
          </script>
        </body>
      </html>
    `;
  }, [sandboxCode, sandboxComponentName, theme]);

  return (
    <>
      <style>{`
      @media (max-width: 1023px) {
        .resize-left { height: calc(${panelSize}% - 4px) !important; flex: none !important; }
        .resize-right { height: calc(${100 - panelSize}% - 4px) !important; flex: none !important; }
      }
      @media (min-width: 1024px) {
        .resize-left { width: calc(${panelSize}% - 8px) !important; flex: none !important; }
        .resize-right { width: calc(${100 - panelSize}% - 8px) !important; flex: none !important; }
      }
    `}</style>
      <div
        ref={containerRef}
        className={`transition-all duration-300  p-2 overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 z-[9999] w-screen h-dvh p-2 md:p-4 bg-base-300 flex flex-col lg:flex-row"
            : "flex flex-col lg:flex-row w-full h-[680px] md:h-[500px] border border-base-300 rounded-3xl bg-base-200 shadow-lg"
        }`}
      >
        {/* Left side: Editor */}
        <div
          className={`flex flex-col h-full bg-base-100 rounded-2xl overflow-hidden ${!isResizing ? "transition-all duration-300" : ""} ${
            showPreview
              ? "flex-1 border-r border-base-300 resize-left"
              : "w-full flex-grow"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-base-300/50 border-b border-base-300 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Code Editor
            </span>
            <div className="flex gap-2 items-center">
              {/* Show/Hide Preview Button on Large Screen */}
              <button
                onClick={() => setShowPreview((prev) => !prev)}
                className="hidden lg:flex text-xs btn btn-xs btn-outline border-none rounded-lg px-1.5"
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="text-xs btn btn-xs btn-outline border-none rounded-lg px-1.5"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
              <button
                onClick={() => {
                  setCode(defaultCode);
                  setExecutedCode(defaultCode);
                }}
                className="text-xs btn btn-xs btn-outline border-none rounded-lg px-1.5"
                title="Reset Code"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleFormat}
                className="text-[10px] btn btn-xs btn-outline rounded-lg px-2 font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Format
              </button>
              <button
                onClick={handleRun}
                className="btn btn-xs bg-green-500 btn-success rounded-lg text-[10px] font-bold flex items-center gap-1 text-white hover:scale-[1.01] active:scale-[0.99] px-2 transition-transform"
              >
                ▶ Run Code
              </button>
            </div>
          </div>
          <div className="flex-1 w-full overflow-hidden">
            <Editor
              height="100%"
              language={language === "browser" ? "javascript" : (language || "javascript")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(val) => {
                const newCode = val || "";
                setCode(newCode);
                if (setData) setData({ code: newCode });
              }}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "Fira Code, Monaco, Courier New, monospace",
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {showPreview && (
          <div
            className="flex w-full lg:w-2 h-2 lg:h-auto cursor-row-resize lg:cursor-col-resize hover:bg-primary/50 active:bg-primary/80 transition-colors items-center justify-center rounded-full z-10 shrink-0 select-none"
            onMouseDown={startResizing}
            onTouchStart={startResizing}
          >
            <div className="h-1 lg:h-8 w-8 lg:w-1 bg-base-content/20 rounded-full" />
          </div>
        )}

        {/* Right side: Preview */}
        <div
          className={`flex flex-col bg-base-100 rounded-2xl overflow-hidden ${!isResizing ? "transition-all duration-300" : ""} ${
            showPreview
              ? "flex-1 border border-base-300 resize-right"
              : "lg:hidden h-[44px] shrink-0 border border-base-300"
          }`}
        >
          <div
            onClick={() => {
              // Clicking the header bar on mobile acts as a toggle
              if (window.innerWidth < 1024) {
                setShowPreview((prev) => !prev);
              }
            }}
            className="flex items-center px-4 py-2.5 bg-base-300/50 border-b border-base-300 shrink-0 select-none cursor-pointer lg:cursor-default"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              {isScriptMode ? "💻 Terminal / Console" : "🖥️ Browser View"}
            </span>
            {showPreview && !isScriptMode && (
              <div className="hidden md:flex bg-base-100 border border-base-300 px-3 py-1 rounded-xl text-[10px] font-mono text-base-content/65 select-none truncate ml-auto mr-2">
                http://localhost:5173/demo
              </div>
            )}

            {/* Expand/Collapse Toggle Button for Small Screen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview((prev) => !prev);
              }}
              className="lg:hidden ml-auto text-xs btn btn-xs btn-outline border-none rounded-lg px-1.5"
              title={showPreview ? "Collapse" : "Expand"}
            >
              {showPreview ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </button>
          </div>
          <div
            className={`flex-1 overflow-y-auto relative flex flex-col transition-colors duration-300 ${
              !showPreview ? "hidden lg:flex" : ""
            } ${
              isScriptMode || error
                ? "bg-slate-950 p-6 text-slate-100"
                : "bg-base-100 text-base-content"
            }`}
          >
            {error ? (
              <div className="absolute inset-0 p-4 bg-red-950/80 text-red-400 font-mono text-xs overflow-y-auto whitespace-pre-wrap">
                <h4 className="font-bold mb-1">
                  🚨 Compilation / Runtime Error:
                </h4>
                {error}
              </div>
            ) : isScriptMode ? (
              <div className="font-mono text-xs space-y-2 w-full">
                {consoleLogs.map((log, index) => {
                  let colorClass = "text-slate-300";
                  let prefix = "";
                  if (log.type === "error") {
                    colorClass = "text-red-400";
                    prefix = "🔴 ";
                  } else if (log.type === "warn") {
                    colorClass = "text-yellow-400";
                    prefix = "🟡 ";
                  } else if (log.type === "info") {
                    colorClass = "text-blue-400 italic";
                    prefix = "ℹ️ ";
                  } else {
                    prefix = "❯ ";
                  }
                  return (
                    <div
                      key={index}
                      className={`${colorClass} whitespace-pre-wrap break-all border-b border-slate-900 pb-1.5`}
                    >
                      <span className="select-none text-slate-500 mr-1">
                        {prefix}
                      </span>
                      {log.text}
                    </div>
                  );
                })}
              </div>
            ) : sandboxCode && sandboxComponentName ? (
              <iframe
                srcDoc={iframeSrcDoc}
                title="Live Preview"
                className={`w-full h-full border-none bg-transparent ${isResizing ? "pointer-events-none" : ""}`}
              />
            ) : (
              <span className="text-xs text-base-content/40 m-auto">
                No output to display.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sandbox;
