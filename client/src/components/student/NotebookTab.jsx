import { useState, useEffect } from "react";
import { RichTextEditor } from "@imksh/editor";
import "@imksh/editor/style.css";

const NotebookTab = ({ notes, currentPath, handleNoteChange }) => {
  const [content, setContent] = useState(() => notes[currentPath] || "");

  // Reset local state when active path changes
  useEffect(() => {
    setContent(notes[currentPath] || "");
  }, [currentPath, notes]);

  const handleChange = (val) => {
    setContent(val);
    handleNoteChange(val);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
          <span>✏️</span> Notes{" "}
          <span className="hidden md:flex">for this Lesson</span>
        </h3>
      </div>
      <div className="w-full">
        <RichTextEditor
          value={content}
          placeholder="Start writing..."
          onChange={handleChange}
          height={350}
        />
      </div>
    </div>
  );
};

export default NotebookTab;
