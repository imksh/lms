import React from "react";

const LearnTab = ({ activeTopic }) => {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Explanation */}
      <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>💡</span> Explanation
        </h3>
        <p className="text-base-content/85 leading-relaxed text-base">
          {activeTopic.introduction}
        </p>
      </div>

      {/* Analogy */}
      <div className="card bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/25 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
          <span>🎭</span> Real-World Analogy
        </h3>
        <p className="text-base-content/85 leading-relaxed italic text-base">
          {activeTopic.analogy}
        </p>
      </div>

      {/* Why Use It */}
      {activeTopic.whyUse && activeTopic.whyUse.length > 0 && (
        <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔥</span> Key Advantages & Use Cases
          </h3>
          <ul className="space-y-3">
            {activeTopic.whyUse.map((reason, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="text-success font-bold">✔</span>
                <span className="text-base-content/80">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Syntax Code Blueprint */}
      <div className="card bg-neutral text-neutral-content rounded-3xl p-6 shadow-inner font-mono relative overflow-hidden">
        <div className="absolute top-3 right-4 text-xs font-black text-neutral-content/40 tracking-wider">
          BLUEPRINT
        </div>
        <h3 className="text-base font-bold mb-4 text-primary text-opacity-90">
          Code Example
        </h3>
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
          <code>{activeTopic.syntax}</code>
        </pre>
      </div>
    </div>
  );
};

export default LearnTab;
