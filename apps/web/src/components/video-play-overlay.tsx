import { Play } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface VideoPlayOverlayProps {
    onClick: () => void;
    className?: string;
}

export function VideoPlayOverlay({ onClick, className }: VideoPlayOverlayProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "absolute inset-0 flex items-center justify-center w-full h-full",
                "bg-black/30 hover:bg-black/40 transition-colors duration-200",
                "group cursor-pointer",
                className
            )}
            aria-label="Reproducir video"
        >
            <div className="bg-white/90 p-4 rounded-full group-hover:scale-110 transition-transform duration-200">
                <Play className="w-8 h-8 text-accent-brand" />
            </div>
        </button>
    );
} 