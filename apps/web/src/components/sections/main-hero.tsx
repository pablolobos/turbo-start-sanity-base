"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { useRef, useState } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";
import { VideoControl } from "../video-control";

type MainHeroBlockProps = PagebuilderType<"mainHero">;

export function MainHeroBlock({
    title,
    buttons,
    badge,
    image,
    richText,
    backgroundType,
    backgroundImage,
    backgroundVideo,
}: MainHeroBlockProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const handleVideoToggle = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            void videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <section id="main-hero" className="relative flex items-center h-[600px] overflow-hidden">
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full">
                {backgroundType === "video" && backgroundVideo ? (
                    <>
                        {/* Optional poster image while video loads */}
                        {image?.asset && (
                            <div className="absolute inset-0 w-full h-full">
                                <SanityImage
                                    asset={image}
                                    alt={image.alt ?? "Video poster"}
                                    fill
                                    priority
                                    quality={90}
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            poster={image?.asset ? undefined : undefined}
                        >
                            <source src={backgroundVideo} type="video/mp4" />
                        </video>
                        <VideoControl
                            isPlaying={isPlaying}
                            onToggle={handleVideoToggle}
                        />
                    </>
                ) : backgroundImage?.asset ? (
                    <SanityImage
                        asset={backgroundImage}
                        alt={backgroundImage.alt ?? "Background"}
                        fill
                        priority
                        quality={90}
                        className="object-cover"
                    />
                ) : null}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            </div>

            {/* Content */}
            <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
                <div className="items-center gap-8 grid lg:grid-cols-2">
                    <div className="space-y-6 text-white">
                        {badge && (
                            <Badge className="bg-white/10 hover:bg-white/20 text-white">
                                {badge}
                            </Badge>
                        )}
                        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                            {title}
                        </h1>
                        <RichText
                            richText={richText}
                            className="text-white/90 text-lg md:text-xl"
                        />
                        <SanityButtons
                            buttons={buttons}
                            buttonClassName={cn(
                                "w-full sm:w-auto",
                                "bg-white text-black hover:bg-white/90"
                            )}
                            size="lg"
                            className="flex sm:flex-row flex-col gap-4 pt-4"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
} 