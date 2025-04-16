'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from "@workspace/ui/lib/utils";
import dynamic from 'next/dynamic';
import { SanityImage } from '../sanity-image';

// Dynamically import Swiper components to avoid SSR issues
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

// Import Swiper styles in client component
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Swiper modules
import { Navigation, Pagination, A11y } from 'swiper/modules';

import type { PagebuilderType, SanityImageProps } from "@/types";

interface GalleryImage {
    _key: string;
    image: SanityImageProps;
    caption?: string;
}

interface ImageGalleryProps {
    title?: string;
    description?: string;
    layout: 'grid' | 'carousel' | 'masonry';
    columns?: '2' | '3' | '4';
    images: GalleryImage[];
}

export type ImageGalleryBlockProps = PagebuilderType<"imageGallery">;

export function ImageGallery({
    title,
    description,
    layout = 'grid',
    columns = '3',
    images,
}: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

    const handleImageClick = (image: GalleryImage) => {
        setActiveImage(image);
    };

    const closeModal = () => {
        setActiveImage(null);
    };

    const getColumnClass = () => {
        switch (columns) {
            case '2':
                return 'grid-cols-1 sm:grid-cols-2';
            case '3':
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            case '4':
                return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        }
    };

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
            {title && (
                <h2 className="mb-4 font-bold text-gray-900 text-3xl tracking-tight">{title}</h2>
            )}
            {description && (
                <p className="mb-8 max-w-3xl text-gray-500 text-lg">{description}</p>
            )}

            {layout === 'carousel' ? (
                <div className="w-full">
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="h-full"
                    >
                        {images.map((image) => (
                            <SwiperSlide key={image._key} className="h-full">
                                <div
                                    className="relative bg-gray-100 rounded-none w-full aspect-[4/3] overflow-hidden cursor-pointer"
                                    onClick={() => handleImageClick(image)}
                                >
                                    <SanityImage
                                        asset={image.image}
                                        alt={image.image.alt}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                    {image.caption && (
                                        <div className="right-0 bottom-0 left-0 absolute bg-black bg-opacity-60 p-2 text-white">
                                            <p className="text-sm">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : layout === 'masonry' ? (
                <div className={cn('grid gap-4', getColumnClass())}>
                    {images.map((image, index) => (
                        <div
                            key={image._key}
                            className={cn(
                                'relative overflow-hidden rounded-none bg-gray-100 cursor-pointer',
                                index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
                            )}
                            onClick={() => handleImageClick(image)}
                        >
                            <SanityImage
                                asset={image.image}
                                alt={image.image.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                            />
                            {image.caption && (
                                <div className="right-0 bottom-0 left-0 absolute bg-black bg-opacity-60 p-2 text-white">
                                    <p className="text-sm">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={cn('grid gap-4', getColumnClass())}>
                    {images.map((image) => (
                        <div
                            key={image._key}
                            className="relative bg-gray-100 rounded-none w-full aspect-[4/3] overflow-hidden cursor-pointer"
                            onClick={() => handleImageClick(image)}
                        >
                            <SanityImage
                                asset={image.image}
                                alt={image.image.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                            />
                            {image.caption && (
                                <div className="right-0 bottom-0 left-0 absolute bg-black bg-opacity-60 p-2 text-white">
                                    <p className="text-sm">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {activeImage && (
                <div
                    className="z-50 fixed inset-0 flex justify-center items-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={closeModal}
                >
                    <div className="relative flex flex-col items-center bg-black/30 shadow-xl rounded w-full max-w-5xl h-auto max-h-[90vh] overflow-hidden">
                        <button
                            type="button"
                            className="top-4 right-4 z-10 absolute bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeModal();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="relative flex justify-center items-center p-4 w-full max-h-[80vh]">
                            <SanityImage
                                asset={activeImage.image}
                                alt={activeImage.image.alt}
                                className="rounded w-auto max-h-[70vh] object-contain"
                                fill={false}
                                width={1200}
                                height={800}
                                quality={90}
                            />
                        </div>
                        {activeImage.caption && (
                            <div className="bg-black/60 p-4 w-full text-white text-center">
                                <p>{activeImage.caption}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
} 