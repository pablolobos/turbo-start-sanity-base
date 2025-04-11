"use client";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

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
    return (
        <section id="main-hero" className="relative flex items-center min-h-[80vh] overflow-hidden">
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full">
                {backgroundType === "video" && backgroundVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
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
                    {image?.asset && (
                        <div className="relative mx-auto w-full lg:max-w-none max-w-lg aspect-square">
                            <SanityImage
                                asset={image}
                                alt={image.alt ?? title ?? "Hero image"}
                                width={600}
                                height={600}
                                priority
                                quality={90}
                                className="shadow-2xl rounded-2xl"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} 