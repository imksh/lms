import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Globe, ChevronRight } from "lucide-react";
import { cmsService } from "../../services/cmsService";
import SubjectCard from "../../components/student/SubjectCard";

const PublicSubjectsPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchPaginatedSubjects = async () => {
      setLoading(true);
      try {
        const { data } = await cmsService.getPaginatedPublicSubjects(page, limit);
        setSubjects(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch public subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaginatedSubjects();
  }, [page]);

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

  return (
    <div className="px-4 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-ghost btn-circle border border-base-300"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-2">
            <Globe className="text-primary" /> Public Content
          </h2>
          <p className="text-xs text-base-content/50 mt-1">
            Explore our publicly available subjects and learning materials.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subj) => (
              <SubjectCard
                key={subj._id || subj.key}
                subj={subj}
                onNavigate={navigateToSubject}
              />
            ))}
          </div>
          
          {subjects.length === 0 && (
             <div className="flex flex-col items-center gap-3 py-24 text-base-content/30">
               <Globe size={48} />
               <p className="font-bold text-lg">No public subjects available</p>
             </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className="btn btn-circle btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-sm font-bold">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-circle btn-outline btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicSubjectsPage;
