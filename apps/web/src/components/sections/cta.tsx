import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({ richText, title, eyebrow, buttons }: CTABlockProps) {
  return (
    <section id="cta-block" className="">
      <div className="container mx-auto px-4 md:px-6 bg-muted py-16 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-8">
          {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-balance">
            {title}
          </h2>
          <div className="text-lg text-muted-foreground">
            <RichText richText={richText} />
          </div>
          <SanityButtons buttons={buttons} />
        </div>
      </div>
    </section>
  );
}
