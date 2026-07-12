import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { cmsService } from "../../services/cmsService";
import { ArrowLeft, Layers } from "lucide-react";
import { useCacheStore } from "../../stores/useCacheStore";

const SubjectPage = () => {
  const { moduleKey, subjectKey } = useParams();
  const [topics, setLocalTopics] = useState([]);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cachedSubjects = useCacheStore((state) => state.subjects);
  const setCacheSubjects = useCacheStore((state) => state.setSubjects);
  const cachedTopics = useCacheStore((state) => state.allTopics);
  const setCacheTopics = useCacheStore((state) => state.setAllTopics);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let subsData = cachedSubjects;
        let topsData = cachedTopics;

        const promises = [];
        if (!subsData) {
          promises.push(cmsService.getSubjects().then((res) => {
            subsData = res.data;
            setCacheSubjects(subsData);
          }));
        }
        if (!topsData) {
          promises.push(cmsService.getTopics().then((res) => {
            topsData = res.data;
            setCacheTopics(topsData);
          }));
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }

        const subj = subsData.find((s) => s.key === subjectKey);
        if (subj) setSubjectTitle(subj.title);

        const filteredTopics = topsData.filter(
          (t) => t.subjectKey === subjectKey,
        );
        setLocalTopics(filteredTopics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [subjectKey, cachedSubjects, cachedTopics, setCacheSubjects, setCacheTopics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="px-2 py-8 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex gap-2 items-center ml-2">
        {/* <div className="text-sm breadcrumbs text-base-content/60">
          <ul>
            <li><Link to="/">LMS</Link></li>
            <li><Link to={`/${moduleKey}`}>{moduleKey}</Link></li>
            <li>{subjectKey}</li>
          </ul>
        </div> */}
        <Link to={`/${moduleKey}`}>
          <ArrowLeft className="font-bold"/>
        </Link>
        <h2 className="text-3xl font-extrabold capitalize">
          {subjectTitle || subjectKey}
        </h2>
        {/* <p className="text-base-content/70">Select a topic to start learning.</p> */}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {topics.map((topic, index) => (
          <Link
            key={topic._id || topic.topicId}
            to={`/${moduleKey}/${subjectKey}/${topic.topicId.replace(/^\//, "")}`}
            className="group flex items-center justify-between p-5 border border-base-300 bg-base-100 hover:bg-base-200 rounded-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold">
                {index + 1}
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {topic.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-base-content/60 mt-1">
                  {topic.difficulty && <span>⚡ {topic.difficulty}</span>}
                  {topic.duration && <span>⏱️ {topic.duration}</span>}
                </div>
              </div>
            </div>
            <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-bold text-sm">
              Start Topic →
            </span>
          </Link>
        ))}
        {topics.length === 0 && (
          <div className="py-12 text-center text-base-content/50 border border-dashed border-base-300 rounded-2xl">
            No topics available for this subject yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
