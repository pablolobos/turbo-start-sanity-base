import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { PagebuilderType } from '@/types'
import type { SanityFile } from '@/types/sanity'
import { SanityImage } from "../sanity-image"
import { VideoPlayOverlay } from "../video-play-overlay"

// Dynamically import ReactPlayer for better performance
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
    ssr: false, // Disable server-side rendering
})

type Props = PagebuilderType<'videoBlock'>

export function VideoBlock(props: Props) {
    const {
        title,
        videoType,
        mp4File,
        youtubeUrl,
        showControls = 'yes',
        autoplay = 'no',
        loop = 'no',
        allowFullscreen = 'no',
        posterImage,
    } = props

    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [videoError, setVideoError] = useState<string | null>(null)
    const [showVideo, setShowVideo] = useState(false)

    // Process video URL similar to main-hero
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

    // Show video immediately if no poster image or if autoplay is enabled
    useEffect(() => {
        if (!posterImage?.asset || autoplay === 'yes') {
            setShowVideo(true)
        }
    }, [posterImage, autoplay])

    // Only render if we have a valid URL
    if (!videoUrl) {
        if (videoError) {
            console.error('VideoBlock:', videoError)
        }
        return null
    }

    return (
        <section className="max-container padding-center section-y-padding-tb">
            {title && (
                <h2 className="mb-8 font-bold text-2xl md:text-3xl text-center">
                    {title}
                </h2>
            )}
            <div className="relative w-full aspect-video">
                {/* Poster image */}
                {posterImage?.asset && !showVideo && (
                    <div className="absolute inset-0 w-full h-full">
                        <SanityImage
                            asset={posterImage}
                            alt={posterImage.alt ?? "Video poster"}
                            fill
                            priority
                            quality={90}
                            className="object-cover"
                        />
                        <VideoPlayOverlay onClick={() => setShowVideo(true)} />
                    </div>
                )}

                {/* Video player */}
                {showVideo && (
                    <ReactPlayer
                        url={videoUrl}
                        width="100%"
                        height="100%"
                        controls={showControls === 'yes'}
                        playing={autoplay === 'yes'}
                        loop={loop === 'yes'}
                        playsinline
                        onError={(e) => {
                            console.error('VideoBlock: Player error', e)
                            setVideoError("Error playing video")
                        }}
                        config={{
                            youtube: {
                                playerVars: {
                                    // YouTube player options
                                    modestbranding: 1,
                                    rel: 0,
                                    fs: allowFullscreen === 'yes' ? 1 : 0,
                                },
                            },
                            file: {
                                attributes: {
                                    // HTML5 video attributes for MP4
                                    controlsList: 'nodownload',
                                    disablePictureInPicture: true,
                                },
                                forceVideo: true,
                            },
                        }}
                    />
                )}

                {videoError && (
                    <div className="right-8 bottom-20 absolute bg-red-500/80 p-2 rounded text-white text-sm">
                        {videoError}
                    </div>
                )}
            </div>
        </section>
    )
} 