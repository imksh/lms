import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

const PracticeTab = ({ activeTopic, exerciseAnswers, currentPath, handleAnswerChange }) => {
  const quizzes = activeTopic?.quiz ?? [];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Reset submission state when path changes or answers change
  useEffect(() => {
    setIsSubmitted(false);
  }, [currentPath, exerciseAnswers]);

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col gap-4 animate-fadeIn">
        <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-sm text-base-content/60 text-center">
          No self-review quizzes available for this topic yet.
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    let currentScore = 0;
    quizzes.forEach((q, idx) => {
      const selected = exerciseAnswers[`${currentPath}_${idx}`];
      if (selected !== undefined && parseInt(selected) === q.correctAnswerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      

      {quizzes.map((q, idx) => (
        <div
          key={idx}
          className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm flex flex-col gap-4"
        >
          <h4 className="font-bold text-base flex gap-2">
            <span className="text-primary">Q{idx + 1}.</span>
            <span>{q.question}</span>
          </h4>
          
          <div className="flex flex-col gap-2 mt-2">
            {q.options && q.options.length > 0 ? (
              q.options.map((opt, oIdx) => {
                const isSelected = exerciseAnswers[`${currentPath}_${idx}`] === String(oIdx);
                const isCorrect = isSubmitted && oIdx === q.correctAnswerIndex;
                const isIncorrectSelection = isSubmitted && isSelected && oIdx !== q.correctAnswerIndex;
                
                let containerClass = "flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ";
                
                if (isSubmitted) {
                  containerClass += " pointer-events-none ";
                  if (isCorrect) containerClass += " bg-success/20 border-success/50 ";
                  else if (isIncorrectSelection) containerClass += " bg-error/20 border-error/50 ";
                  else containerClass += " border-base-300 opacity-50 ";
                } else {
                  containerClass += " border-base-300 hover:bg-base-100 ";
                }

                return (
                  <label key={oIdx} className={containerClass}>
                    <input 
                      type="radio" 
                      name={`quiz_${currentPath}_${idx}`}
                      className="radio radio-primary radio-sm"
                      checked={isSelected}
                      onChange={() => handleAnswerChange(idx, String(oIdx))}
                      disabled={isSubmitted}
                    />
                    <span className="text-sm font-medium flex-1">{opt}</span>
                    {isCorrect && <CheckCircle size={16} className="text-success" />}
                    {isIncorrectSelection && <AlertTriangle size={16} className="text-error" />}
                  </label>
                );
              })
            ) : (
              <textarea
                placeholder="Write your explanation or code solution here..."
                className="textarea textarea-bordered bg-base-100 rounded-2xl focus:textarea-primary text-sm min-h-[120px] p-4 w-full"
                value={exerciseAnswers[`${currentPath}_${idx}`] || ""}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
              />
            )}
          </div>
        </div>
      ))}

      {/* Action Footer */}
      <div className="mt-4 flex items-center justify-between bg-base-200 border border-base-300 p-4 rounded-3xl">
        <div className="flex flex-col">
          {isSubmitted && (
            <div className="text-sm font-bold">
              Your Score: <span className={score === quizzes.length ? "text-success" : "text-warning"}>{score} / {quizzes.length}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isSubmitted ? (
            <button onClick={handleReset} className="btn btn-sm btn-ghost rounded-xl">
              <RefreshCw size={14} /> Retry Quiz
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn btn-sm btn-primary rounded-xl px-6"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeTab;
