import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";

import { CTACard } from "../cta-card";
import { RichText } from "../richtext";

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({
  richText,
  title,
  eyebrow,
  ctaCards,
}: CTABlockProps) {
  return (
    <section id="cta" className="my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <RichText richText={richText} />
          </div>

          {/* Social Media Grid */}
          <div className="mt-16 grid w-full grid-cols-1 gap-4 lg:gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {ctaCards?.map((card, idx) => (
              <CTACard
                title={card.title ?? ""}
                description={card.description ?? ""}
                href={card.url ?? ""}
                logo={card.logo ?? ""}
                key={idx}
                className={cn(
                  "hover:bg-muted-foreground/20 duration-300 transition-colors",
                  idx === 0 && "lg:rounded-l-3xl lg:rounded-r-none",
                  idx === ctaCards.length - 1 &&
                    "lg:rounded-r-3xl lg:rounded-l-none",
                  idx !== 0 && idx !== ctaCards.length - 1 && "lg:rounded-none",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
