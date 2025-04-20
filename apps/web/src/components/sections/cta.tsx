import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({ richText, title, eyebrow, buttons }: CTABlockProps) {
  return (
    <section id="features" className="max-container padding-center section-y-padding-tb">
      <div className="mx-auto">
        <div className="bg-muted px-4 py-16">
          <div className="space-y-8 mx-auto max-w-3xl text-center">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="bg-zinc-200"
              >
                {eyebrow}
              </Badge>
            )}
            <h2 className="heading-2">
              {title}
            </h2>
            <div className="text-muted-foreground text-lg">
              <RichText richText={richText} className="text-balance" />
            </div>
            <div className="flex justify-center">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="lg:justify-start gap-2 grid sm:grid-flow-col mb-8 w-full sm:w-fit"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
