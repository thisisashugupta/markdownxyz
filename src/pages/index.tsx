import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useActions } from "@/hooks/useActions";
import { ActionBar } from "@/components/feat/actionbar";
// import { SavedIndicator } from "@/components/feat/saved-indicator";

const Index = () => {
  const actions = useActions();

  const {
    noteContent,
    showPreview,
    textareaRef,
    handleChange,
  } = actions;

  return (
    <div className="h-screen flex flex-col bg-[#090909] overflow-hidden">
      {/* <SavedIndicator actions={actions} className="md:hidden flex p-4" /> */}
      <ActionBar actions={actions} className="hidden md:flex" />
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
      <ActionBar actions={actions} className="flex md:hidden" />
    </div>
  );
};

export default Index;
