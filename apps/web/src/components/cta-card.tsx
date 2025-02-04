import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { SanityImage } from "./sanity-image";

interface CTACardProps {
  href: string;
  title: string;
  description: string;
  logo: any;
  className?: string;
}

export function CTACard({
  href,
  logo,
  title,
  description,
  className,
}: CTACardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-3xl p-8 md:p-10 transition-colors bg-accent hover:bg-accent/60",
        className,
      )}
    >
      <div className="flex flex-col space-y-2">
        <SanityImage
          asset={logo}
          loading="eager"
          priority
          quality={100}
          className="mb-6"
        />
        <h3 className="text-xl font-[500] text-[#111827]">{title}</h3>
        <p className="text-sm text-[#374151]">{description}</p>
      </div>
    </Link>
  );
}
