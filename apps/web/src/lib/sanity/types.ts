export interface VideoBlock {
    _type: 'videoBlock'
    title?: string
    videoType: 'mp4' | 'youtube'
    mp4File?: string
    youtubeUrl?: string
    showControls: 'yes' | 'no'
    autoplay: 'yes' | 'no'
    loop: 'yes' | 'no'
    allowFullscreen: 'yes' | 'no'
} 