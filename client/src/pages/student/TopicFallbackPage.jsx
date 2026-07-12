import React from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const TopicFallbackPage = () => {
  const { moduleKey, subjectKey } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-2 py-8 md:p-8 text-center animate-fadeIn">
      <div className="p-4 bg-error/10 text-error rounded-full mb-4">
        <AlertCircle size={48} />
      </div>
      <h2 className="text-3xl font-extrabold">Topic Not Found</h2>
      <p className="text-base-content/70 max-w-md">
        The topic you're looking for doesn't exist or is currently unavailable. 
        Please check the URL or return to the subject page.
      </p>
      {moduleKey && subjectKey ? (
        <Link to={`/${moduleKey}/${subjectKey}`} className="btn btn-primary mt-4">
          Return to {subjectKey}
        </Link>
      ) : (
        <Link to="/" className="btn btn-primary mt-4">
          Go to Home
        </Link>
      )}
    </div>
  );
};

export default TopicFallbackPage;
