import { SanityImage } from "@/components/sanity-image";
import { RichText } from "@/components/richtext";
import type { PagebuilderType } from "@/types";

type AspectCardProps = {
    aspect: NonNullable<PagebuilderType<"highlightedAspects">["aspects"]>[number];
    className?: string;
};

export function AspectCard({ aspect, className = "" }: AspectCardProps) {
    const { title, image, content, variant = "image" } = aspect || {};

    if (!aspect) {
        return (
            <article className="gap-4 grid grid-cols-1 w-full">
                <div className="bg-muted rounded-none h-48 animate-pulse" />
                <div className="space-y-2">
                    <div className="bg-muted rounded-none w-24 h-4 animate-pulse" />
                    <div className="bg-muted rounded-none w-full h-6 animate-pulse" />
                    <div className="bg-muted rounded-none w-3/4 h-4 animate-pulse" />
                </div>
            </article>
        );
    }

    return (
        <article className={`content-start gap-2 lg:gap-6 grid grid-cols-1 grid-rows-[auto_auto_1fr] w-full ${className}`}>
            {variant !== 'none' && image?.asset && (
                <div className={`relative rounded-none w-full h-auto overflow-hidden ${variant === 'icon'
                    ? 'aspect-square max-w-[120px] mx-auto'
                    : 'aspect-[16/9]'
                    }`}>
                    <SanityImage
                        asset={image}
                        width={variant === 'icon' ? 120 : 800}
                        height={variant === 'icon' ? 120 : 400}
                        alt={title || "Aspecto destacado"}
                        className={`bg-gray-100 rounded-none w-full object-cover ${variant === 'icon'
                            ? 'aspect-square p-4'
                            : 'aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2]'
                            }`}
                    />
                    <div className="absolute inset-0 ring-1 ring-gray-900/10 ring-inset" />
                </div>
            )}
            <div className={`content-start grid grid-rows-subgrid ${variant === 'none' ? 'row-span-3' : 'row-span-2'} w-full`}>
                <h3 className="group relative heading-4">
                    {title}
                </h3>
                {content && (
                    <div className="group relative">
                        <RichText
                            richText={content}
                            className="prose-p:first:mt-0 prose-p:last-of-type:mb-0 prose-sm"
                        />
                    </div>
                )}
            </div>
        </article>
    );
} 