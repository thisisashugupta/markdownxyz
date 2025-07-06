import { Check } from "lucide-react";
import type { TUseActionsReturn } from "@/types";

export function SavedIndicator({ actions, className } : { actions: TUseActionsReturn; className?: string }) {
    const {
        isTyping,
        showSaveIndicator,
    } = actions;

    return (
        <div className={`flex justify-start items-center gap-2 ${className}`}>
            <div className={`${showSaveIndicator && !isTyping ? 'visible' : 'invisible'} text-[#7C3AED] animate-fade-in-out flex items-center gap-1`}>
                <Check className="w-4 h-4" />
                <span className="text-md">Saved</span>
            </div>
        </div>
    );
}