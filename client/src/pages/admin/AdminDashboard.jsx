import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { cmsService } from "../../services/cmsService";
import AdminLayout from "../../components/layouts/AdminLayout";

import MetaSection from "../../components/admin/MetaSection";
import ModulesSection from "../../components/admin/ModulesSection";
import SubjectsSection from "../../components/teacher/SubjectsSection";
import TopicsSection from "../../components/teacher/TopicsSection";
import EvaluationsSection from "../../components/teacher/EvaluationsSection";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user,  } = useAuthStore();

  const isAdmin =  user?.role === "admin";

  const [section, setSection] = useState("meta");
  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

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

  useEffect(() => {
    if (isAdmin) {
      fetchSubjects();
      fetchModules();
    }
  }, [isAdmin, fetchSubjects, fetchModules]);

  if (!isAdmin) {
    return (
      <div className="min-h-dvh bg-base-100 flex items-center justify-center p-8">
        <div className="text-center max-w-sm flex flex-col gap-5">
          <h2 className="text-3xl font-black text-error">Access Denied</h2>
          <p className="text-base-content/60 text-sm">
            You need Admin access to view this panel.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary rounded-xl font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Breadcrumb / navigation helpers
  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setSection("subjects");
  };
  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj);
    setSection("topics");
  };
  const handleSectionChange = (id) => {
    setSection(id);
    if (id === "modules") {
      setSelectedModule(null);
      setSelectedSubject(null);
    }
    if (id === "subjects") {
      setSelectedSubject(null);
    }
  };

  return (
    <AdminLayout activeSection={section} onSectionChange={handleSectionChange}>
      {/* Breadcrumb trail when drilling down */}
      {(selectedModule || selectedSubject) && (
        <div className="px-6 pt-4 flex items-center gap-1.5 text-xs text-base-content/50">
          <button
            onClick={() => {
              setSection("modules");
              setSelectedModule(null);
              setSelectedSubject(null);
            }}
            className="hover:text-primary font-semibold transition-colors"
          >
            Modules
          </button>
          <ChevronRight size={12} />
          {selectedModule && (
            <>
              <button
                onClick={() => {
                  setSection("subjects");
                  setSelectedSubject(null);
                }}
                className="hover:text-primary font-semibold transition-colors"
              >
                {selectedModule.title}
              </button>
              {selectedSubject && <ChevronRight size={12} />}
            </>
          )}
          {selectedSubject && (
            <span className="font-bold text-base-content">
              {selectedSubject.title}
            </span>
          )}
        </div>
      )}

      {section === "meta" && <MetaSection />}

      {section === "modules" && (
        <ModulesSection
          modules={modules}
          fetchModules={fetchModules}
          onSelectModule={handleSelectModule}
          isAdmin={true}
        />
      )}

      {section === "subjects" && (
        <SubjectsSection
          selectedModule={selectedModule}
          onSelectSubject={handleSelectSubject}
          subjects={subjects}
          fetchSubjects={fetchSubjects}
          isAdmin={true}
          modules={modules}
        />
      )}

      {section === "topics" && (
        <TopicsSection selectedSubject={selectedSubject} subjects={subjects} />
      )}

      {section === "evaluations" && <EvaluationsSection />}
    </AdminLayout>
  );
};

export default AdminDashboard;
