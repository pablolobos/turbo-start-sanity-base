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
    <section id="hero" className="bg-volvo-blue md:my-16 mt-4 font-volvo text-volvo-white">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="items-center gap-8 grid lg:grid-cols-2">
          <div className="justify-items-center lg:justify-items-start items-center lg:items-start gap-4 grid grid-rows-[auto_1fr_auto] h-full lg:text-left text-center">
            <Badge variant="secondary" className="text-detail-1">{badge}</Badge>
            <div className="gap-4 grid">
              <h1 className="font-bold text-display-3 md:text-display-2 tracking-tight">
                {title}
              </h1>
              <RichText
                richText={richText}
                className="text-body-2 md:text-body-1"
              />
            </div>

            <SanityButtons
              buttons={buttons}
              buttonClassName="w-full sm:w-auto text-body-2"
              className="lg:justify-start gap-2 grid sm:grid-flow-col mb-8 w-full sm:w-fit"
            />
          </div>

          {image && (
            <div className="w-full h-96">
              <SanityImage
                asset={image}
                loading="eager"
                width={800}
                height={800}
                priority
                quality={80}
                className="rounded-volvo-lg w-full max-h-96 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
