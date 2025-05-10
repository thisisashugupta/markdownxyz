import { useState, useEffect, useRef } from "react";
import { Download, Check } from "lucide-react";

const Index = () => {
  const [noteContent, setNoteContent] = useState("");
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load note from localStorage on initial render
  useEffect(() => {
    const savedNote = localStorage.getItem("notepad-content");
    if (savedNote) {
      setNoteContent(savedNote);
    }
  }, []);

  // Handle typing state
  useEffect(() => {
    if (isTyping) {
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 500);
      return () => clearTimeout(typingTimer);
    }
  }, [isTyping]);

  // Auto-save note when content changes
  useEffect(() => {
    if (!isTyping) {
      const saveTimer = setTimeout(() => {
        if (noteContent !== localStorage.getItem("notepad-content")) {
          saveNote();
        }
      }, 500);
      return () => clearTimeout(saveTimer);
    }
  }, [noteContent, isTyping]);

  const saveNote = () => {
    localStorage.setItem("notepad-content", noteContent);
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
    setIsTyping(true);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([noteContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "my_note.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Format the displayed content with styled heading and body text
  const formatContent = () => {
    if (!noteContent) return null;
    
    const lines = noteContent.split("\n");
    const firstLine = lines[0];
    const remainingLines = lines.slice(1).join("\n");
    
    return (
      <div className="notepad-content">
        <div className="heading">{firstLine}</div>
        {remainingLines && <div className="body-text">{remainingLines}</div>}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#090909] overflow-hidden">
      <div className="flex-none p-4">
        <div className="flex justify-end items-center gap-2">
          {showSaveIndicator && !isTyping && (
            <div className="text-[#7C3AED] animate-fade-in-out flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span className="text-sm">Saved</span>
            </div>
          )}
          <button 
            onClick={handleDownload}
            className="bg-transparent hover:bg-[#7C3AED]/40 text-[#7C3AED] rounded-md px-3 py-1 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1024px] h-full relative">
          <textarea 
            ref={textareaRef}
            value={noteContent}
            onChange={handleChange}
            placeholder="Start typing your note here..."
            className="text-white/50 absolute inset-0 w-full h-full resize-none p-4 bg-[#090909] focus:ring-0 focus:outline-none overflow-y-auto"
            autoFocus
            style={{ opacity: 100, caretColor: '#7C3AED' }}
          />
          {noteContent ? formatContent() : (
            <div className="p-4 text-white/50 text-lg">Start typing your note here...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
