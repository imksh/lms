import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sandbox from "../../components/student/Sandbox";
import { RichTextEditor } from "@imksh/editor";
import "@imksh/editor/style.css";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import * as SiIcons from "react-icons/si";
import * as LuIcons from "lucide-react";
import { cmsService } from "../../services/cmsService";
import { useAuthStore } from "../../store/useAuthStore";
import { useCacheStore } from "../../stores/useCacheStore";
import { ChevronLeft, Globe, Lock } from "lucide-react";

import SubjectCard, {
  getIconComponent,
} from "../../components/student/SubjectCard";
import Loading from "../../components/Loading";

const defaultReactCode = `import React from "react";

function App() {
  return (
    <div className="flex justify-center item-center h-full w-full">
      Code here...
    </div>
  );
}`;

const defaultJSCode = `// JavaScript Playground\n\nconsole.log("Code here...");\n`;

// ─── Module Card ──────────────────────────────────────────────────────────────
const ModuleCard = ({ mod, onClick }) => {
  const Icon = getIconComponent(mod.icon);
  return (
    <div
      className={`card border ${mod.color || "border-base-300 bg-base-100"} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl overflow-hidden cursor-pointer relative`}
      onClick={() => onClick(mod)}
    >
      {mod.isPublic && (
        <span className="absolute top-3 right-3 badge badge-xs badge-success badge-soft gap-1 text-[10px]">
          <Globe size={9} /> Public
        </span>
      )}
      <div className="card-body p-6 flex flex-col gap-3">
        <span className="text-3xl p-2 bg-base-100 rounded-xl shadow-inner border border-base-300/40 w-fit">
          <Icon className={mod.iconColor || "text-primary"} />
        </span>
        <div>
          <h4 className="text-base font-extrabold group-hover:text-primary transition-colors">
            {mod.title}
          </h4>
          <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
            {mod.description || mod.desc}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-base-300/40">
          <span className="text-[11px] text-base-content/50">
            {mod.subjects?.length ?? 0} subject
            {mod.subjects?.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-black text-primary group-hover:translate-x-1 transition-transform">
            Explore →
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Section Divider ──────────────────────────────────────────────────────────
const SectionDivider = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/40 uppercase tracking-widest shrink-0">
      <Icon size={12} />
      {label}
    </div>
    <div className="flex-1 border-t border-base-300/60" />
  </div>
);

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [lang, setLang] = useState("react");
  const sandboxRef = useRef(null);

  // Data state
  const [modules, setModules] = useState([]); // accessible modules (from /modules)
  const [subjects, setSubjects] = useState([]); // accessible subjects (from /cms/subjects)
  const [loading, setLoading] = useState(true);

  // Drill-down state (multi-module view)
  const [selectedModule, setSelectedModule] = useState(null);

  // Fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const state = useCacheStore.getState();
        let mods = state.modules;
        let subs = state.subjects;

        const promises = [];
        if (!mods) promises.push(cmsService.getModules().then(res => { mods = res.data; useCacheStore.getState().setModules(mods); }));
        if (!subs) promises.push(cmsService.getSubjects().then(res => { subs = res.data; useCacheStore.getState().setSubjects(subs); }));

        if (promises.length > 0) {
          await Promise.all(promises);
        }

        setModules(mods || []);
        setSubjects(subs || []);
      } catch (err) {
        console.error("Failed to fetch LMS data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Keep theme in sync with document attribute changes
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

  // Navigate to a subject's first topic
  const navigateToSubject = (subj) => {
    let modPath = "default";
    if (subj.module) {
      if (subj.module.path && subj.module.path !== "/") {
        modPath = subj.module.path.replace(/^\//, "");
      } else if (subj.module._id) {
        modPath = subj.module._id;
      } else if (typeof subj.module === "string") {
        modPath = subj.module;
      }
    }
    const parts = [modPath, subj.key];
    navigate("/" + parts.join("/"));
  };

  // ── Partition subjects into "assigned" vs "public" ──────────────────────────
  // "Assigned" = subject's parent module is in user.module[] (or user is admin/teacher)
  // "Public"   = subject (or its parent module) is flagged isPublic
  const assignedModuleIds = new Set((user?.module || []).map(String));
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  const isSubjectAssigned = (subj) => {
    if (isAdminOrTeacher) return true;
    const modId = subj.module?._id
      ? String(subj.module._id)
      : String(subj.module);
    return assignedModuleIds.has(modId);
  };

  const assignedSubjects = subjects.filter((s) => isSubjectAssigned(s));
  // Public = accessible but NOT in user's assigned list (or no module set)
  const publicSubjects = subjects.filter(
    (s) => !isSubjectAssigned(s) && (s.isPublic || s.module?.isPublic),
  );

  // ── Module view logic ────────────────────────────────────────────────────────
  // Modules that actually contain subjects the user has access to
  const assignedModules = modules.filter(
    (m) =>
      !m.isPublic &&
      assignedSubjects.some((s) => {
        const modId = s.module?._id ? String(s.module._id) : String(s.module);
        return modId === String(m._id);
      }),
  );
  const publicModules = modules.filter((m) => m.isPublic);

  // If admin/teacher, "assignedModules" = all non-public modules
  const allNonPublicModules = isAdminOrTeacher
    ? modules.filter((m) => !m.isPublic)
    : assignedModules;

  // Decide view mode
  const showMultiModule = allNonPublicModules.length > 1;

  // Subjects to show in the current drill-down (multi-module)
  const drillSubjects = selectedModule
    ? assignedSubjects.filter((s) => {
        const modId = s.module?._id ? String(s.module._id) : String(s.module);
        return modId === String(selectedModule._id);
      })
    : [];

  // ── Render helpers ───────────────────────────────────────────────────────────
  const renderSubjectGrid = (list, emptyMsg = "No subjects available.") => {
    if (list.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center gap-2 py-12 text-base-content/30">
          <LuIcons.BookOpen size={36} />
          <p className="text-sm font-bold">{emptyMsg}</p>
        </div>
      );
    }
    return list.map((subj) => (
      <SubjectCard
        key={subj._id || subj.key}
        subj={subj}
        onNavigate={navigateToSubject}
      />
    ));
  };

  if (loading) {
    return <Loading />;
  }

  // ── SINGLE MODULE (or no module distinction) ─────────────────────────────────
  if (!showMultiModule) {
    return (
      <div className="px-4 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fadeIn">
        {/* Assigned Subjects */}
        {assignedSubjects.length > 0 && (
          <section className="flex flex-col gap-4">
            {assignedSubjects.length > 0 &&
              allNonPublicModules.length === 1 && (
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold">
                    {allNonPublicModules[0].title}
                  </h3>
                  {allNonPublicModules[0].isPublic === false && (
                    <span className="badge badge-xs badge-primary gap-1">
                      <Lock size={9} /> Your Class
                    </span>
                  )}
                </div>
              )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSubjectGrid(assignedSubjects)}
            </div>
          </section>
        )}

        {/* Public Subjects */}
        {publicSubjects.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionDivider icon={Globe} label="Public Content" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSubjectGrid(publicSubjects.slice(0, 6))}
            </div>
            {publicSubjects.length > 6 && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => navigate("/public-subjects")}
                  className="btn btn-outline btn-primary rounded-full px-8 font-bold"
                >
                  View More
                </button>
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {assignedSubjects.length === 0 && publicSubjects.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-base-content/30">
            <LuIcons.BookOpen size={48} />
            <p className="font-bold text-lg">No content available yet</p>
            <p className="text-sm">Ask your admin to assign you to a module.</p>
          </div>
        )}

        <PlaygroundSection
          sandboxRef={sandboxRef}
          lang={lang}
          setLang={setLang}
          defaultCode={defaultCode}
          theme={theme}
          content={content}
          setContent={setContent}
        />
      </div>
    );
  }

  // ── MULTI-MODULE — drill-down view ────────────────────────────────────────────
  if (selectedModule) {
    return (
      <div className="px-4 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fadeIn">
        {/* Back button + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedModule(null)}
            className="btn btn-sm btn-ghost btn-circle border border-base-300"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-extrabold">{selectedModule.title}</h2>
            <p className="text-xs text-base-content/50">
              {drillSubjects.length} subject
              {drillSubjects.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSubjectGrid(drillSubjects, "No subjects in this module.")}
        </div>

        <PlaygroundSection
          sandboxRef={sandboxRef}
          lang={lang}
          setLang={setLang}
          defaultCode={defaultCode}
          theme={theme}
          content={content}
          setContent={setContent}
        />
      </div>
    );
  }

  // Module list view
  return (
    <div className="px-4 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-fadeIn">
      {/* Assigned Modules */}
      {allNonPublicModules.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="text-xl font-extrabold">Your Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNonPublicModules.map((mod) => (
              <ModuleCard key={mod._id} mod={mod} onClick={setSelectedModule} />
            ))}
          </div>
        </section>
      )}

      {/* Public Modules */}
      {publicModules.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionDivider icon={Globe} label="Public Modules" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicModules.map((mod) => (
              <ModuleCard key={mod._id} mod={mod} onClick={setSelectedModule} />
            ))}
          </div>
        </section>
      )}

      {allNonPublicModules.length === 0 && publicModules.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-base-content/30">
          <LuIcons.BookOpen size={48} />
          <p className="font-bold text-lg">No content available yet</p>
          <p className="text-sm">Ask your admin to assign you to a module.</p>
        </div>
      )}

      <PlaygroundSection
        sandboxRef={sandboxRef}
        lang={lang}
        setLang={setLang}
        defaultCode={defaultCode}
        theme={theme}
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

// ─── Playground + Notebook section (shared across views) ──────────────────────
const PlaygroundSection = ({
  sandboxRef,
  lang,
  setLang,
  defaultCode,
  theme,
  content,
  setContent,
}) => (
  <>
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
      <Sandbox defaultCode={defaultCode} theme={theme} />
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
  </>
);

export default Home;
