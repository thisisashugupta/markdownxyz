import { useState, useEffect, useRef } from "react";
import { Download, Check, Eye, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

const Index = () => {
  const [noteContent, setNoteContent] = useState("");
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState(() => {
    return localStorage.getItem("notepad-download-format") || "md";
  });
  const [showCopyIndicator, setShowCopyIndicator] = useState(false);

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
    const ext = downloadFormat === "md" ? "md" : "txt";
    const mime = downloadFormat === "md" ? "text/markdown" : "text/plain";
    const element = document.createElement("a");
    const file = new Blob([noteContent], { type: mime });
    element.href = URL.createObjectURL(file);
    element.download = `my_note.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(noteContent);
      setShowCopyIndicator(true);
      setTimeout(() => setShowCopyIndicator(false), 2000);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleFormatChange = (value: string) => {
    setDownloadFormat(value);
    localStorage.setItem("notepad-download-format", value);
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
            onClick={() => setShowPreview((prev) => !prev)}
            className={`bg-transparent hover:bg-[#7C3AED]/40 text-[#7C3AED] rounded-md px-3 py-1 flex items-center gap-2 transition-colors ${
              showPreview ? "bg-[#7C3AED]/20" : ""
            }`}
          >
            <Eye className="w-4 h-4" />{" "}
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button
            onClick={handleCopy}
            className="hover:bg-[#7C3AED]/40 text-[#7C3AED] px-3 py-1 transition-colors border border-[#7C3AED] rounded-md w-16 h-[34px] flex items-center justify-center"
          >
            {showCopyIndicator ? <Check size={20} /> : 'Copy'}
          </button>
          <div className="flex">
            <button
              onClick={handleDownload}
              className="bg-transparent hover:bg-[#7C3AED]/40 text-[#7C3AED] rounded-l-md rounded-none px-3 py-1 flex items-center gap-2 transition-colors border border-[#7C3AED] border-r-0 focus:z-10"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              <Download className="w-4 h-4" /> Download
            </button>
            
            <Select value={downloadFormat} onValueChange={handleFormatChange}>
              <SelectTrigger className="rounded-md rounded-l-none border-l-0 focus:z-10 outline-none cursor-pointer bg-transparent hover:bg-[#7C3AED]/20 text-[#7C3AED] px-2 py-1 border border-[#7C3AED]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="md">.md</SelectItem>
                <SelectItem value="txt">.txt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center overflow-hidden">
        <AnimatePresence>
          <div
            className={`w-full max-w-[1920px] h-full relative grid ${
              showPreview ? "grid-cols-2" : "grid-cols-1"
            }`}
            style={{ minWidth: 0 }}
          >
            {/* Left Panel: Editor */}
            <motion.textarea
              ref={textareaRef}
              value={noteContent}
              onChange={handleChange}
              placeholder="Write here..."
              key="markdown-panel"
              initial={{ opacity: 0.5, width: "100%" }}
              animate={{
                opacity: 1,
                width: showPreview ? "100%" : "100%",
                flex: showPreview ? 1 : 1,
                x: showPreview ? 0 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`h-full text-white/80 bg-[#090909] border-x border-gray-800 shadow-lg overflow-y-auto p-6 transition-all duration-300 focus:ring-0 focus:outline-none resize-none col-span-1 ${
                showPreview ? "z-10" : "z-0"
              }`}
              style={{
                gridColumn: "1 / span 1",
                width: "100%",
                opacity: 100,
                caretColor: "#7C3AED",
                transition: "width 0.3s",
              }}
              autoFocus
            />
            {/* Right Panel: Markdown Preview */}
            {showPreview && (
              <motion.div
                key="preview-panel"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full z-10 bg-[#18181b] border-l border-[#27272a] shadow-lg overflow-y-auto p-6 col-span-1"
                style={{ minWidth: 0, gridColumn: "2 / span 1" }}
              >
                <div className="prose prose-invert max-w-none text-white">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {noteContent || "Nothing to preview."}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
