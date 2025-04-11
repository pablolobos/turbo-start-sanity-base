import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";

import { CTACard } from "../image-link-card";
import { RichText } from "../richtext";

export type ImageLinkCardsProps = PagebuilderType<"imageLinkCards">;

export function ImageLinkCards({
  richText,
  title,
  eyebrow,
  cards,
}: ImageLinkCardsProps) {
  return (
    <section id="image-link-cards" className="my-16">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="font-semibold text-3xl md:text-5xl text-balance">
              {title}
            </h2>
            <RichText richText={richText} className="text-balance" />
          </div>

          {/* Social Media Grid */}
          {Array.isArray(cards) && cards.length > 0 && (
            <div className="gap-4 lg:gap-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-16 w-full">
              {cards?.map((card, idx) => (
                <CTACard
                  key={card._key}
                  card={card}
                  className={cn(
                    "bg-muted-foreground/10",
                    idx === 0 && "lg:rounded-l-3xl lg:rounded-r-none",
                    idx === cards.length - 1 &&
                    "lg:rounded-r-3xl lg:rounded-l-none",
                    idx !== 0 && idx !== cards.length - 1 && "lg:rounded-none",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
