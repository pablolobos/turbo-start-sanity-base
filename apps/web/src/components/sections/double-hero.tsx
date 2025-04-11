import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

type DoubleHeroBlockProps = PagebuilderType<"doubleHero">;

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

const HeroSection = ({
    title,
    badge,
    richText,
    image,
    buttons,
    isInverted,
    variant,
}: {
    title: string | null;
    badge?: string | null;
    richText?: any[] | null;
    image?: any;
    buttons?: any[] | null;
    isInverted?: boolean;
    variant?: string | null;
}) => (
    <div className="relative h-full min-h-[50vh] lg:min-h-full">
        {/* Background Image with Overlay */}
        {image?.asset && (
            <div className="absolute inset-0 w-full h-full">
                <SanityImage
                    asset={image}
                    alt={image.alt ?? "Background"}
                    fill
                    priority
                    quality={90}
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            </div>
        )}

        {/* Content */}
        <div className={cn(
            "relative h-full z-10 flex items-center",
        )}>
            <div className="w-full">
                <div className="padding-half-left justify-items-start items-center lg:items-start content-stretch gap-4 grid grid-rows-[auto_auto] col-span-1 lg:group-odd/component:col-start-2 row-span-1 row-start-1 text-left component-height">
                    <div className="gap-4 grid">
                        {badge && <Badge className="w-fit">{badge}</Badge>}
                        <h2 className={cn("heading-1", {
                            "text-white": variant && !["default", "alt"].includes(variant)
                        })}>
                            {title}
                        </h2>
                        <RichText
                            richText={richText}
                            className={cn("font-normal text-base md:text-lg", {
                                "text-white": variant && !["default", "alt"].includes(variant)
                            })}
                        />
                    </div>

                    {buttons && buttons.length > 0 && (
                        <SanityButtons
                            buttons={buttons}
                            buttonClassName="w-full sm:w-auto"
                            size="default"
                            className="lg:justify-start gap-2 grid sm:grid-flow-col mb-8 w-full sm:w-fit"
                        />
                    )}
                </div>
            </div>
        </div>
    </div>
);

export function DoubleHeroBlock({
    variant,
    primaryBadge,
    primaryTitle,
    primaryRichText,
    primaryImage,
    primaryButtons,
    secondaryBadge,
    secondaryTitle,
    secondaryRichText,
    secondaryImage,
    secondaryButtons,
}: DoubleHeroBlockProps) {
    const backgroundClasses = getVariantClasses(variant);

    return (
        <section className={cn("relative overflow-hidden", backgroundClasses)}>
            <div className="mx-auto">
                <div className="grid lg:grid-cols-2 component-height">
                    <HeroSection
                        title={primaryTitle}
                        badge={primaryBadge}
                        richText={primaryRichText}
                        image={primaryImage}
                        buttons={primaryButtons}
                        variant={variant}
                    />
                    <HeroSection
                        title={secondaryTitle}
                        badge={secondaryBadge}
                        richText={secondaryRichText}
                        image={secondaryImage}
                        buttons={secondaryButtons}
                        variant={variant}
                        isInverted
                    />
                </div>
            </div>
        </section>
    );
} 