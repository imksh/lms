import React from "react";
import { Link } from "react-router-dom";

const BottomNavigation = ({ topicsList, currentPath }) => {
  const idx = topicsList.findIndex((t) => t.path === currentPath);
  const prevTopic = idx > 0 ? topicsList[idx - 1] : null;
  const nextTopic = idx < topicsList.length - 1 ? topicsList[idx + 1] : null;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-base-300 shrink-0 ">
      {prevTopic ? (
        <Link
          to={prevTopic.path}
          className="btn btn-outline btn-sm rounded-xl font-bold flex gap-2"
        >
          ← {prevTopic.title.replace(/^\d+\.\s*/, "")}
        </Link>
      ) : (
        <div />
      )}

      {nextTopic ? (
        <Link
          to={nextTopic.path}
          className="btn btn-primary btn-sm rounded-xl font-bold flex gap-2"
        >
          {nextTopic.title.replace(/^\d+\.\s*/, "")} →
        </Link>
      ) : (
        <Link
          to="/"
          className="btn btn-success btn-sm rounded-xl font-bold flex gap-2"
        >
          Back to Course Dashboard
        </Link>
      )}
    </div>
  );
};

export default BottomNavigation;
