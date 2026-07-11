import React from "react";

const PracticeTab = ({ activeTopic, exerciseAnswers, currentPath, handleAnswerChange }) => {
  const questions = activeTopic?.questions ?? [];

  if (questions.length === 0) {
    return (
      <div className="flex flex-col gap-4 animate-fadeIn">
        <div className="p-4 bg-base-200 border border-base-300 rounded-2xl text-sm text-base-content/60 text-center">
          No self-review questions available for this topic yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="p-4 bg-success/10 text-success border border-success/20 rounded-2xl flex gap-3 items-center">
        <span className="text-2xl">💪</span>
        <div className="text-sm">
          <span className="font-bold">Self-Review Questions:</span> Draft answers directly inside the notepad boxes below to test your understanding. Your responses are auto-saved locally.
        </div>
      </div>

      {questions.map((question, idx) => (
        <div
          key={idx}
          className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm flex flex-col gap-4"
        >
          <h4 className="font-bold text-base flex gap-2">
            <span className="text-primary">Q{idx + 1}.</span>
            <span>{question}</span>
          </h4>
          <textarea
            placeholder="Write your explanation or code solution here..."
            className="textarea textarea-bordered bg-base-100 rounded-2xl focus:textarea-primary text-sm min-h-[120px] p-4 w-full"
            value={exerciseAnswers[`${currentPath}_${idx}`] || ""}
            onChange={(e) => handleAnswerChange(idx, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default PracticeTab;
