"use client";

import { Pause, Play } from "lucide-react";
import { useState, type HTMLAttributes } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface VideoControlProps extends HTMLAttributes<HTMLButtonElement> {
    isPlaying: boolean;
    onToggle: () => void;
}

export function VideoControl({
    isPlaying,
    onToggle,
    className,
    ...props
}: VideoControlProps) {
    return (
        <div className="right-[0] lg:right-4 bottom-[0] lg:bottom-2 z-[50] absolute lg:opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 ease-in-out">
            <button
                onClick={onToggle}
                className={cn(
                    "rounded-full bg-black/30 backdrop-blur-sm p-4",
                    "hover:bg-black/90 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-white/20",
                    "absolute bottom-8 right-8 z-20",
                    "group/button",
                    className
                )}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                {...props}
            >
                {isPlaying ? (
                    <Pause className="w-6 h-6 text-white/60 group-hover/button:text-white" />
                ) : (
                    <Play className="w-6 h-6 text-white/60 group-hover/button:text-white" />
                )}
            </button>
        </div>
    );
} 