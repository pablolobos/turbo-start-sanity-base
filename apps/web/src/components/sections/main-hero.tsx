"use client";

import { Badge } from "@workspace/ui/components/badge";
import { useEffect, useRef, useState } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";
import { VideoControl } from "../video-control";

type MainHeroBlockProps = PagebuilderType<"mainHero">;

// Define types for Sanity file references
interface SanityFileAsset {
    _ref: string;
    _type?: string;
}

interface SanityFile {
    asset?: SanityFileAsset;
    url?: string;
}

export function MainHeroBlock({
    title,
    buttons,
    badge,
    image,
    richText,
    backgroundType,
    backgroundImage,
    backgroundVideo,
    titleFont,
}: MainHeroBlockProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Process backgroundVideo to get the actual URL
    useEffect(() => {
        if (backgroundType === "video" && backgroundVideo) {
            // Extract URL from Sanity file reference
            let url = null;
            if (typeof backgroundVideo === 'string') {
                // If it's already a string URL, use it directly
                url = backgroundVideo;
            } else {
                // Treat as potential Sanity file object
                const fileObj = backgroundVideo as unknown as SanityFile;

                if (fileObj?.asset?._ref) {
                    // Handle Sanity file reference
                    // Format is typically 'file-[id]-[ext]'
                    const ref = fileObj.asset._ref;
                    if (ref.startsWith('file-')) {
                        const parts = ref.split('-');
                        if (parts.length >= 3) {
                            const id = parts[1];
                            const extension = parts[2];
                            if (id && extension) {
                                url = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}.${extension}`;
                            }
                        }
                    }
                } else if (fileObj?.url) {
                    // Handle object with url property
                    url = fileObj.url;
                }
            }

            if (url) {
                setVideoUrl(url);
            } else {
                setVideoError("Could not load video - invalid URL format");
            }
        }
    }, [backgroundType, backgroundVideo]);

    const handleVideoToggle = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            const playPromise = videoRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(error => {
                        setVideoError("Error playing video: " + error.message);
                    });
            }
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    // Handle video errors
    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const target = e.target as HTMLVideoElement;
        setVideoError(target.error ? `Error: ${target.error.message}` : "Unknown video error");
    };

    return (
        <section id="main-hero" className="group/hero relative flex items-center overflow-hidden component-height max-container">
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full component-height">
                {backgroundType === "video" && videoUrl ? (
                    <div className="relative w-full h-full">
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
                            onError={handleVideoError}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {videoError && (
                            <div className="right-8 bottom-20 absolute bg-red-500/80 p-2 rounded text-white text-sm">
                                {videoError}
                            </div>
                        )}
                        <VideoControl
                            isPlaying={isPlaying}
                            onToggle={handleVideoToggle}
                        />
                    </div>
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
                    <div className="space-y-6">
                        {badge && (
                            <Badge className="bg-white/10 hover:bg-white/20 text-white">
                                {badge}
                            </Badge>
                        )}
                        <h1 className={`font-bold text-foreground-inverse text-4xl md:text-5xl lg:text-7xl leading-tight ${titleFont === 'statement' ? 'statement-1' : 'heading-1'}`}>
                            {title}
                        </h1>
                        <RichText
                            richText={richText}
                            className="prose-invert text-foreground-inverse/90 text-lg md:text-xl"
                        />
                        <SanityButtons
                            buttons={buttons}
                            buttonClassName="w-full sm:w-auto"
                            size="default"
                            className="lg:justify-start gap-2 grid sm:grid-flow-col mb-8 w-full sm:w-fit"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
} 