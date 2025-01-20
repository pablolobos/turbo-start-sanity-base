import type { PagebuilderType } from "@/types";
import { Badge } from "@workspace/ui/components/badge";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";
import { RichText } from "../richtext";

type HeroBlockProps = PagebuilderType<"hero">;

export function HeroBlock({
  title,
  buttons,
  badge,
  image,
  richText,
}: HeroBlockProps) {
  return (
    <section className="">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4 items-center justify-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">{badge}</Badge>
            <h1 className="text-pretty text-4xl font-bold lg:text-6xl">
              {title}
            </h1>
            <RichText richText={richText} />
            <SanityButtons
              buttons={buttons}
              buttonClassName="w-full sm:w-auto"
              className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start"
            />
          </div>
          {image && (
            <div className="h-96 w-full">
              <SanityImage
                asset={image}
                loading="eager"
                priority
                className="max-h-96 w-full rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
