import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import MetaSection from "../../components/admin/MetaSection";
import ModulesSection from "../../components/admin/ModulesSection";
import SubjectsSection from "../../components/teacher/SubjectsSection";
import TopicsSection from "../../components/teacher/TopicsSection";
import EvaluationsSection from "../../components/teacher/EvaluationsSection";
import { cmsService } from "../../services/cmsService";

export const AdminSettingsPage = () => {
  return (
    <AdminLayout>
      <MetaSection />
    </AdminLayout>
  );
};

export const AdminModulesPage = () => {
  const [modules, setModules] = useState([]);
  const sectionRef = useRef();

  const fetchModules = useCallback(async () => {
    try {
      const { data } = await cmsService.getModules();
      setModules(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <AdminLayout
      actions={
        <button
          onClick={() => sectionRef.current?.startNew()}
          className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
        >
          <Plus size={14} /> New Module
        </button>
      }
    >
      <ModulesSection
        ref={sectionRef}
        modules={modules}
        fetchModules={fetchModules}
      />
    </AdminLayout>
  );
};

export const AdminSubjectsPage = () => {
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const sectionRef = useRef();

  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);

  const fetchSubjects = useCallback(async () => {
    try {
      const { data } = await cmsService.getSubjects();
      setSubjects(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchModules = useCallback(async () => {
    try {
      const { data } = await cmsService.getModules();
      setModules(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchModules();
  }, [fetchSubjects, fetchModules]);

  // Find the selected module for label or filtering
  const selectedModule = moduleId
    ? modules.find((m) => m._id === moduleId)
    : null;

  return (
    <AdminLayout
      actions={
        <button
          onClick={() => sectionRef.current?.startNew()}
          className="btn btn-sm btn-primary rounded-xl font-bold flex gap-1 items-center"
        >
          <Plus size={14} /> New Subject
        </button>
      }
    >
      <SubjectsSection
        ref={sectionRef}
        selectedModule={selectedModule}
        subjects={subjects}
        fetchSubjects={fetchSubjects}
        isAdmin={true}
        modules={modules}
      />
    </AdminLayout>
  );
};

export const AdminTopicsPage = () => {
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get("subjectKey");

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
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (subjects.length > 0) {
      if (subjectKey) {
        setSelectedSubject(
          subjects.find((s) => s.key === subjectKey) || subjects[0],
        );
      } else {
        setSelectedSubject(subjects[0]);
      }
    }
  }, [subjects, subjectKey]);

  return (
    <AdminLayout>
      <TopicsSection
        selectedSubject={selectedSubject}
        subjects={subjects}
        onSubjectChange={(subj) => setSelectedSubject(subj)}
      />
    </AdminLayout>
  );
};

export const AdminEvaluationsPage = () => {
  return <EvaluationsSection />;
};
