import { Download, Check, Eye, EyeOff, Copy } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import type { TUseActionsReturn } from "@/types";
import { SavedIndicator } from "@/components/feat/saved-indicator";

export function ActionBar({ actions, className } : { actions: TUseActionsReturn; className?: string }) {
    const {
        showCopyIndicator,
        showPreview,
        setShowPreview,
        downloadFormat,
        handleDownload,
        handleCopy,
        handleFormatChange
    } = actions;

    return <div className={`flex items-center justify-between p-4 ${className}`}>
        <SavedIndicator actions={actions} />
        <div className="flex justify-end items-center gap-4">
            {/*  Preview Button  */}
          <button
            onClick={() => setShowPreview((prev) => !prev)}
            className={`bg-transparent hover:bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED] rounded-lg px-1.5 w-[36px] h-[36px] flex items-center justify-center gap-2 transition-colors ${
              showPreview ? "bg-[#7C3AED]/20" : ""
            }`}
          >
            <span className="h-full group-hover:bg-[#7C3AED]/20 px-1.5 flex items-center justify-center rounded-lg">
                <span className="flex justify-center items-center">
                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
            </span>
          </button>
            {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="group text-[#7C3AED] px-1.5 py-1 transition-colors border border-[#7C3AED] rounded-lg w-[36px] h-[36px] flex items-center justify-center"
          >
            <span className="h-full group-hover:bg-[#7C3AED]/20 px-1.5 flex items-center justify-center rounded-lg">
                <span className="flex justify-center items-center">
                    {showCopyIndicator ? <Check size={16} /> : <Copy size={16} />}
                </span>
            </span>
            
            {/* Download Button */}
          </button>
          <div className="flex">
            <button
              onClick={handleDownload}
              className="group bg-transparent text-[#7C3AED] rounded-l-md rounded-r-none px-1.5 flex items-center gap-2 transition-colors border border-[#7C3AED] border-r-0 focus:z-10"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              <span className="py-1.5 px-1.5 flex items-center justify-center gap-1 group-hover:bg-[#7C3AED]/20 rounded-lg">
              <span className="flex justify-center items-center">
                <Download size={16} />
                </span>
              </span>
            </button>
            
            <Select value={downloadFormat} onValueChange={handleFormatChange}>
              <SelectTrigger className="group w-auto pr-1.5 pl-1 rounded-lg rounded-l-none border-l-0 focus:z-10 outline-none cursor-pointer bg-transparent  text-[#7C3AED] border border-[#7C3AED]">
              <div className="m-1 group-hover:bg-[#7C3AED]/20 rounded-lg px-1.5 py-0.5">
                <SelectValue />
              </div>
                
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="md">.md</SelectItem>
                <SelectItem value="txt">.txt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
}