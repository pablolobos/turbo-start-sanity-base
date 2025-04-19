import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

type HeroBlockProps = PagebuilderType<"hero">;

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

export function HeroBlock({
  title,
  buttons,
  badge,
  image,
  richText,
  ...rest
}: HeroBlockProps) {
  // Using optional access to get the variant property that might not be recognized by TypeScript yet
  // @ts-ignore - variant property is added to the schema but not yet in the TypeScript types
  const variant = rest.variant;
  const backgroundClasses = getVariantClasses(variant);

  return (
    <section id="hero" className={cn(backgroundClasses, "max-container mt-12")}>
      <div className="mx-auto">
        <div className="items-center content-center lg:grid lg:grid-cols-2">
          <div className="padding-half-left justify-items-start items-center lg:items-start content-stretch gap-4 grid grid-rows-[auto_auto] col-span-1 lg:group-odd/component:col-start-2 row-span-1 row-start-1 text-left">
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

            <SanityButtons
              buttons={buttons}
              buttonClassName="w-full sm:w-auto"
              size="default"
              className="lg:justify-start gap-2 grid sm:grid-flow-col mb-8 w-full sm:w-fit"
            />
          </div>

          {image && (
            <div className="col-span-1 lg:group-odd/component:col-start-1 row-span-1 row-start-1 w-full h-full">
              <SanityImage
                asset={image}
                loading="eager"
                width={1200}
                height={800}
                priority
                quality={90}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
