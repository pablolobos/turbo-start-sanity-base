'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from "@workspace/ui/lib/utils";
import { SanityImage } from '../sanity-image';
import * as Dialog from '@radix-ui/react-dialog';

// Import Swiper properly
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { PagebuilderType, SanityImageProps } from "@/types";

// Add this CSS at the beginning of the file after imports
const swiperStyles = `
  /* Make sure z-index doesn't interfere with modal */
  .swiper-container, 
  .swiper-wrapper, 
  .swiper-slide,
  .mySwiper {
    z-index: 1;
  }

  .mySwiper {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 40px;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #000;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 40px !important;
    height: 40px !important;
  }

  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 20px !important;
  }

  .swiper-pagination-bullet {
    background: #000;
  }
  
  /* Modal z-index needs to be higher than Swiper */
  .image-gallery-modal {
    z-index: 999 !important;
  }

  /* Fix Swiper elements appearing above modal */
  .swiper-button-next, 
  .swiper-button-prev, 
  .swiper-pagination {
    z-index: 100; 
  }

  /* Radix Dialog styles */
  .DialogOverlay {
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
    position: fixed;
    inset: 0;
    animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 999; /* Lower z-index to not interfere with NextJS error overlay */
  }

  .DialogContent {
    background-color: transparent;
    border-radius: 6px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 1200px;
    max-height: 90vh;
    padding: 16px;
    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Lower z-index to not interfere with NextJS error overlay */
  }

  .DialogContent:focus {
    outline: none;
  }

  .DialogCloseButton {
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 100%;
    padding: 8px;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    z-index: 10;
  }

  .DialogCloseButton:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .DialogCaption {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 16px;
    color: white;
    text-align: center;
    margin-top: auto;
  }

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /* Make sure NextJS error overlay is visible in development */
  /* Higher z-index than NextJS error overlay (which is 9000) would prevent seeing errors */
  /* In production, you can increase these values if needed */
`;

interface GalleryImage {
    _key: string;
    image: SanityImageProps;
    caption?: string;
}

interface ImageGalleryProps {
    title?: string;
    description?: string;
    layout: 'grid' | 'carousel' | 'masonry' | 'bento';
    columns?: '2' | '3' | '4';
    images: GalleryImage[];
    slidesPerRow?: 1 | 2 | 3 | 4 | 5;
}

export type ImageGalleryBlockProps = PagebuilderType<"imageGallery">;

export function ImageGallery({
    title,
    description,
    layout = 'grid',
    columns = '3',
    images,
    slidesPerRow = 2,
}: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Clear modal state at component initialization
    useEffect(() => {
        setActiveImage(null);
        setIsOpen(false);
    }, []);

    // Set isMounted to true when component mounts
    useEffect(() => {
        console.log("Gallery layout:", layout);
        console.log("Images:", images);
        setIsMounted(true);

        // Clean up on unmount
        return () => {
            setActiveImage(null);
            setIsOpen(false);
        };
    }, [layout, images]);

    const handleImageClick = (image: GalleryImage) => {
        setActiveImage(image);
        setIsOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset the active image when dialog closes
            setTimeout(() => setActiveImage(null), 300);
        }
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
            <style jsx global>{swiperStyles}</style>
            {title && layout !== 'bento' && (
                <h2 className="mb-4 font-bold text-gray-900 text-3xl tracking-tight">{title}</h2>
            )}
            {description && (
                <p className="mb-8 max-w-3xl text-gray-500 text-lg">{description}</p>
            )}

            {layout === 'carousel' ? (
                <div className="w-full">
                    {isMounted && (
                        <Swiper
                            modules={[Navigation, Pagination, A11y]}
                            navigation={true}
                            pagination={{ clickable: true }}
                            spaceBetween={slidesPerRow > 2 ? 10 : 20}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: Math.min(2, slidesPerRow) },
                                1024: { slidesPerView: slidesPerRow },
                            }}
                            className="mySwiper"
                        >
                            {images.map((image) => (
                                <SwiperSlide key={image._key}>
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
                                            <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                                <p className="text-sm">{image.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
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
                                <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                    <p className="text-sm">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : layout === 'bento' ? (
                <div className="bg-gray-100 shadow-sm p-6 md:p-8 rounded w-full">
                    {/* Title for the gallery section if needed */}
                    {title && (
                        <h3 className="mb-6 font-medium text-gray-800 text-xl">{title}</h3>
                    )}

                    <div className="space-y-4 md:space-y-6">
                        {/* Top row - two images side by side */}
                        <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2">
                            {/* First image (left) */}
                            {images[0] && (
                                <div
                                    className="relative bg-gray-200 rounded-none aspect-[4/3] overflow-hidden cursor-pointer"
                                    onClick={() => images[0] && handleImageClick(images[0])}
                                >
                                    <SanityImage
                                        asset={images[0].image}
                                        alt={images[0].image.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                    {images[0].caption && (
                                        <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                            <p className="text-sm">{images[0].caption}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Second image (right) */}
                            {images[1] ? (
                                <div
                                    className="relative bg-gray-200 rounded-none aspect-[4/3] overflow-hidden cursor-pointer"
                                    onClick={() => images[1] && handleImageClick(images[1])}
                                >
                                    <SanityImage
                                        asset={images[1].image}
                                        alt={images[1].image.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                    {images[1].caption && (
                                        <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                            <p className="text-sm">{images[1].caption}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative bg-gray-200 rounded-none aspect-[4/3]"></div>
                            )}
                        </div>

                        {/* Bottom row - one larger image */}
                        {images.length > 2 && images[2] ? (
                            <div
                                className="relative bg-gray-200 rounded-none aspect-[21/9] overflow-hidden cursor-pointer"
                                onClick={() => images[2] && handleImageClick(images[2])}
                            >
                                <SanityImage
                                    asset={images[2].image}
                                    alt={images[2].image.alt}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                />
                                {images[2].caption && (
                                    <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                        <p className="text-sm">{images[2].caption}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative bg-gray-200 rounded-none aspect-[21/9]"></div>
                        )}

                        {/* Any additional images shown in a grid */}
                        {images.length > 3 && (
                            <div className={cn('grid gap-4 md:gap-6', getColumnClass())}>
                                {images.slice(3).map((image) => (
                                    <div
                                        key={image._key}
                                        className="relative bg-gray-200 rounded-none w-full aspect-[4/3] overflow-hidden cursor-pointer"
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
                                            <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                                <p className="text-sm">{image.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                                <div className="right-0 bottom-0 left-0 absolute bg-black/60 p-2 text-white">
                                    <p className="text-sm">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Radix Dialog Modal */}
            {activeImage && (
                <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Title className="sr-only">
                                {activeImage?.image?.alt || "Image Preview"}
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="DialogCloseButton" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </Dialog.Close>

                            <div className="flex flex-1 justify-center items-center w-full h-full max-h-[70vh]">
                                {activeImage && (
                                    <div className="relative flex justify-center items-center h-full">
                                        <SanityImage
                                            asset={activeImage.image}
                                            alt={activeImage.image.alt}
                                            className="rounded w-auto max-h-[70vh] object-contain"
                                            fill={false}
                                            width={1200}
                                            height={800}
                                            quality={90}
                                            priority={true}
                                        />
                                    </div>
                                )}
                            </div>

                            {activeImage?.caption && (
                                <div className="DialogCaption">
                                    <p>{activeImage.caption}</p>
                                </div>
                            )}
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </section>
    );
} 