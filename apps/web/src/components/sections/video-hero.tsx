import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";
import type { SanityFile } from '@/types/sanity'

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";

// Dynamically import ReactPlayer for better performance
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
    ssr: false, // Disable server-side rendering
})

type VideoHeroBlockProps = PagebuilderType<"videoHero">;

// Function to map variant to background color classes
const getVariantClasses = (variant?: string | null): string => {
    switch (variant) {
        case "alt":
            return "bg-background-alt";
        case "accent1":
            return "bg-accent-1";
        case "accent2":
            return "bg-accent-2";
        case "brand":
            return "bg-accent-brand";
        default:
            return "bg-background";
    }
};

export function VideoHeroBlock({
    title,
    buttons,
    badge,
    richText,
    titleFont,
    videoType,
    mp4File,
    youtubeUrl,
    showControls = 'yes',
    autoplay = 'no',
    loop = 'no',
    ...rest
}: VideoHeroBlockProps) {
    // @ts-ignore - variant property is added to the schema but not yet in the TypeScript types
    const variant = rest.variant;
    const backgroundClasses = getVariantClasses(variant);

    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [videoError, setVideoError] = useState<string | null>(null)

    // Process video URL
    useEffect(() => {
        if (videoType === 'mp4' && mp4File) {
            // Extract URL from Sanity file reference
            let url = null
            if (typeof mp4File === 'string') {
                // If it's already a string URL, use it directly
                url = mp4File
            } else {
                // Treat as potential Sanity file object
                const fileObj = mp4File as unknown as SanityFile

                if (fileObj?.asset?._ref) {
                    // Handle Sanity file reference
                    // Format is typically 'file-[id]-[ext]'
                    const ref = fileObj.asset._ref
                    if (ref.startsWith('file-')) {
                        const parts = ref.split('-')
                        if (parts.length >= 3) {
                            const id = parts[1]
                            const extension = parts[2]
                            if (id && extension) {
                                url = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}.${extension}`
                            }
                        }
                    }
                } else if (fileObj?.url) {
                    // Handle object with url property
                    url = fileObj.url
                }
            }

            if (url) {
                setVideoUrl(url)
                setVideoError(null)
            } else {
                setVideoError("Could not load video - invalid URL format")
                setVideoUrl(null)
            }
        } else if (videoType === 'youtube' && youtubeUrl) {
            setVideoUrl(youtubeUrl)
            setVideoError(null)
        } else {
            setVideoError("No valid video source provided")
            setVideoUrl(null)
        }
    }, [videoType, mp4File, youtubeUrl])

    return (
        <section id="video-hero" className={cn(backgroundClasses, "max-container mt-12")}>
            <div className="mx-auto">
                <div className="items-center content-center lg:grid lg:grid-cols-2">
                    <div className="padding-half-left justify-items-start items-center lg:items-start content-stretch gap-4 grid grid-rows-[auto_auto] col-span-1 lg:group-odd/component:col-start-2 row-span-1 row-start-1 text-left">
                        <div className="gap-4 grid">
                            {badge && <Badge className="w-fit">{badge}</Badge>}
                            <h2 className={cn(
                                titleFont === 'statement' ? 'statement-2' : 'heading-2',
                                {
                                    "text-white": variant && !["default", "alt"].includes(variant)
                                }
                            )}>
                                {title}
                            </h2>
                            <RichText
                                richText={richText}
                                className={cn("font-normal text-base md:text-lg", {
                                    "text-white": variant && !["default", "alt"].includes(variant)
                                })}
                            />
                        </div>

                        <SanityButtons
                            buttons={buttons}
                            buttonClassName="w-full sm:w-auto"
                            size="default"
                            className="lg:justify-start gap-2 grid sm:grid-flow-col mb-8 w-full sm:w-fit"
                        />
                    </div>

                    {videoUrl && (
                        <div className="col-span-1 lg:group-odd/component:col-start-1 row-span-1 row-start-1 w-full h-full">
                            <div className="relative w-full aspect-video">
                                <ReactPlayer
                                    url={videoUrl}
                                    width="100%"
                                    height="100%"
                                    controls={showControls === 'yes'}
                                    playing={autoplay === 'yes'}
                                    loop={loop === 'yes'}
                                    playsinline
                                    onError={(e) => {
                                        console.error('VideoHeroBlock: Player error', e)
                                        setVideoError("Error playing video")
                                    }}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                modestbranding: 1,
                                                rel: 0,
                                            },
                                        },
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload',
                                                disablePictureInPicture: true,
                                            },
                                            forceVideo: true,
                                        },
                                    }}
                                />
                                {videoError && (
                                    <div className="right-8 bottom-20 absolute bg-red-500/80 p-2 rounded text-white text-sm">
                                        {videoError}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} 