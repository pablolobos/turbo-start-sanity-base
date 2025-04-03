import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

type HeroBlockProps = PagebuilderType<"hero">;

export function HeroBlock({
  title,
  buttons,
  badge,
  image,
  richText,
}: HeroBlockProps) {
  return (
    <section id="hero" className="bg-background mt-4">
      <div className="mx-auto">
        <div className="items-center grid lg:grid-cols-2">
          <div className="justify-items-start items-center lg:items-start gap-4 grid grid-rows-[auto_auto] lg:text-left text-center">
            <div className="gap-4 grid">
              <Badge className="w-fit" variant="secondary">{badge}</Badge>
              <h1 className="heading-1">
                {title}
              </h1>
              <RichText
                richText={richText}
                className="font-normal text-base md:text-lg"
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
            <div className="bg-slate-500 w-full h-full aspect-square">
              <SanityImage
                asset={image}
                loading="eager"
                width={800}
                height={800}
                priority
                quality={80}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
