import { RefObject } from "react";

export type TUseActionsReturn = {
  noteContent: string;
  setNoteContent: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  showSaveIndicator: boolean;
  setShowSaveIndicator: React.Dispatch<React.SetStateAction<boolean>>;
  showCopyIndicator: boolean;
  setShowCopyIndicator: React.Dispatch<React.SetStateAction<boolean>>;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  downloadFormat: string;
  setDownloadFormat: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: RefObject<HTMLTextAreaElement>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  saveNote: () => void;
  handleDownload: () => void;
  handleCopy: () => Promise<void>;
  handleFormatChange: (value: string) => void;
};
