import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "./sanity-image";

export type CTACardProps = {
  card: NonNullable<PagebuilderType<"imageLinkCards">["cards"]>[number];
  className?: string;
};

export function CTACard({ card, className }: CTACardProps) {
  const { image, description, title, href } = card ?? {};
  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "rounded-3xl p-4 md:p-8 transition-colors relative overflow-hidden group flex flex-col justify-end xl:h-[400px]",
        className,
      )}
    >
      {image?.asset && (
        <div className="z-[1] absolute inset-0 mix-blend-multiply">
          <SanityImage
            asset={image}
            loading="eager"
            priority
            quality={100}
            fill
            className="opacity-40 group-hover:opacity-100 grayscale object-cover group-hover:transition-opacity duration-1000 pointer-events-none"
          />
        </div>
      )}
      <div className="xl:top-24 group-hover:top-8 z-[2] xl:absolute xl:inset-x-8 flex flex-col space-y-2 mb-4 pt-64 duration-500">
        <h3 className="font-[500] text-[#111827]">
          {title}
        </h3>
        <p className="xl:group-hover:opacity-100 xl:opacity-0 text-[#374151] text-sm transition-opacity duration-300 delay-150">
          {description}
        </p>
      </div>
    </Link>
  );
}
