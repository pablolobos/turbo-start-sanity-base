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
  titleFont,
  ...rest
}: HeroBlockProps) {
  // Using optional access to get the variant and imageAlignment properties
  // @ts-ignore - properties are added to the schema but not yet in the TypeScript types
  const variant = rest.variant;
  // @ts-ignore
  const imageAlignment = rest.imageAlignment || 'default';
  const backgroundClasses = getVariantClasses(variant);

  return (
    <section id="hero" className={cn(backgroundClasses, "max-container")}>
      <div className="mx-auto">
        <div className="items-center content-stretch lg:grid lg:grid-cols-2 component-height">
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

          {image && (
            <div className="col-span-1 lg:group-odd/component:col-start-1 row-span-1 row-start-1 w-full h-full">
              <SanityImage
                asset={image}
                loading="eager"
                width={1200}
                height={800}
                priority
                quality={90}
                className={cn(
                  "w-full h-full",
                  imageAlignment === "default" ? "object-cover" : "object-contain p-4 bg-red-400 w-[80%]"
                )}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
