import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "./sanity-image";

export type CTACardProps = {
  card: NonNullable<PagebuilderType<"cta">["ctaCards"]>[number];
  className?: string;
};

export function CTACard({ card, className }: CTACardProps) {
  const { image, description, title, url } = card ?? {};
  return (
    <Link
      href={url ?? "#"}
      className={cn(
        "rounded-3xl p-8 md:p-10 transition-colors bg-accent hover:bg-accent/60",
        className,
      )}
    >
      <div className="flex flex-col space-y-2">
        {image?.asset && (
          <SanityImage
            asset={image}
            loading="eager"
            priority
            quality={100}
            className="mb-6"
          />
        )}
        <h3 className="text-xl font-[500] text-[#111827]">{title}</h3>
        <p className="text-sm text-[#374151]">{description}</p>
      </div>
    </Link>
  );
}
