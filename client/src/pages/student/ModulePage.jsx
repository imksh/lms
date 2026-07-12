import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cmsService } from "../../services/cmsService";
import { BookOpen } from "lucide-react";
import Loading from "../../components/Loading";
import { useCacheStore } from "../../stores/useCacheStore";

const ModulePage = () => {
  const { moduleKey } = useParams();
  const [subjects, setLocalSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState(moduleKey);

  const cachedSubjects = useCacheStore((state) => state.subjects);
  const setCacheSubjects = useCacheStore((state) => state.setSubjects);
  const cachedModules = useCacheStore((state) => state.modules);
  const setCacheModules = useCacheStore((state) => state.setModules);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        let subsData = cachedSubjects;
        if (!subsData) {
          const { data } = await cmsService.getSubjects();
          subsData = data;
          setCacheSubjects(data);
        }

        let modsData = cachedModules;
        if (!modsData) {
          const { data } = await cmsService.getModules();
          modsData = data;
          setCacheModules(data);
        }

        const currentMod = modsData.find(
          (m) =>
            m.path === `/${moduleKey}` ||
            m.path === moduleKey ||
            m.key === moduleKey ||
            m._id === moduleKey
        );
        if (currentMod && currentMod.title) {
          setModuleTitle(currentMod.title);
        }

        // Try to filter subjects that belong to this module
        const filtered = subsData.filter((s) => {
          const m = s.module;
          return (
            m &&
            (m.path === `/${moduleKey}` ||
              m.path === moduleKey ||
              m.key === moduleKey ||
              m._id === moduleKey)
          );
        });
        setLocalSubjects(filtered.length > 0 ? filtered : subsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [moduleKey, cachedSubjects, cachedModules, setCacheSubjects, setCacheModules]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-2 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold capitalize">Module: {moduleTitle}</h2>
        <p className="text-base-content/70">
          Select a subject to continue learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {subjects.map((subj) => (
          <Link
            key={subj.key}
            to={`/${moduleKey}/${subj.key}`}
            className="card border border-base-300 bg-base-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
          >
            <div className="card-body p-6 flex flex-col gap-4">
              <span className="text-3xl p-2 bg-base-100 rounded-xl shadow-inner border border-base-300/40 w-fit">
                <BookOpen className="text-primary" />
              </span>
              <h4 className="text-lg font-bold">{subj.title}</h4>
              <p className="text-sm text-base-content/70">{subj.desc}</p>
            </div>
          </Link>
        ))}
        {subjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-base-content/50">
            No subjects found in this module.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulePage;
