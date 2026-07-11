import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { cmsService } from "../../services/cmsService";
import AdminLayout from "../../components/layouts/AdminLayout";

import SubjectsSection from "../../components/teacher/SubjectsSection";
import TopicsSection from "../../components/teacher/TopicsSection";
import EvaluationsSection from "../../components/teacher/EvaluationsSection";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isTeacher =  user?.role === "teacher";

  const [section, setSection] = useState("subjects");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const fetchSubjects = useCallback(async () => {
    try {
      const { data } = await cmsService.getSubjects();
      setSubjects(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (isTeacher) {
      fetchSubjects();
    }
  }, [isTeacher, fetchSubjects]);

  if (!isTeacher) {
    return (
      <div className="min-h-dvh bg-base-100 flex items-center justify-center p-8">
        <div className="text-center max-w-sm flex flex-col gap-5">
          <h2 className="text-3xl font-black text-error">Access Denied</h2>
          <p className="text-base-content/60 text-sm">
            You need Teacher access to view this panel.
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
  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj);
    setSection("topics");
  };
  const handleSectionChange = (id) => {
    setSection(id);
    if (id === "subjects") {
      setSelectedSubject(null);
    }
  };

  return (
    <AdminLayout activeSection={section} onSectionChange={handleSectionChange}>
      {/* Breadcrumb trail when drilling down */}
      {selectedSubject && (
        <div className="px-6 pt-4 flex items-center gap-1.5 text-xs text-base-content/50">
          <button
            onClick={() => {
              setSection("subjects");
              setSelectedSubject(null);
            }}
            className="hover:text-primary font-semibold transition-colors"
          >
            Subjects
          </button>
          <ChevronRight size={12} />
          <span className="font-bold text-base-content">
            {selectedSubject.title}
          </span>
        </div>
      )}

      {section === "subjects" && (
        <SubjectsSection
          selectedModule={null}
          onSelectSubject={handleSelectSubject}
          subjects={subjects}
          fetchSubjects={fetchSubjects}
          isAdmin={false}
          modules={[]}
        />
      )}

      {section === "topics" && (
        <TopicsSection selectedSubject={selectedSubject} subjects={subjects} />
      )}

      {section === "evaluations" && <EvaluationsSection />}
    </AdminLayout>
  );
};

export default TeacherDashboard;
