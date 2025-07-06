import { useState, useEffect, useRef } from "react";
import type { TUseActionsReturn } from "@/types";

export const useActions: () => TUseActionsReturn = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [noteContent, setNoteContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showSaveIndicator, setShowSaveIndicator] = useState(false);
    const [showCopyIndicator, setShowCopyIndicator] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState(() => {
        return localStorage.getItem("notepad-download-format") || "md";
    });
    

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

    return {
        noteContent,
        setNoteContent,
        isTyping,
        setIsTyping,
        showSaveIndicator,
        setShowSaveIndicator,
        showCopyIndicator,
        setShowCopyIndicator,
        showPreview,
        setShowPreview,
        downloadFormat,
        setDownloadFormat,
        textareaRef,
        handleChange,
        saveNote,
        handleDownload,
        handleCopy,
        handleFormatChange
    };
}