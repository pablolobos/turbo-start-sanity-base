import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Github, Twitter } from "lucide-react";

import type { PagebuilderType } from "@/types";

import { CTACard } from "../cta-card";
import { RichText } from "../richtext";

const SOCIAL_LINKS = [
  {
    href: "https://github.com",
    icon: Github,
    title: "GitHub",
    description:
      "Explore our projects, contribute, and collaborate with the community.",
  },
  {
    href: "https://reddit.com",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    title: "Reddit",
    description:
      "Join the conversation, share insights, and engage with our community.",
  },
  {
    href: "https://twitter.com",
    icon: Twitter,
    title: "X (Formerly Twitter)",
    description:
      "Follow us for the latest updates, insights, and announcements.",
  },
  {
    href: "https://discord.com",
    icon: Github,
    title: "Discord",
    description:
      "Join the discussion, ask questions, and connect with our team.",
  },
] as const;

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({ buttons, richText, title }: CTABlockProps) {
  return (
    <section className="my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge variant="secondary">Stay informed</Badge>
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <RichText richText={richText} />
          </div>

          {/* Social Media Grid */}
          <div className="mt-16 grid w-full grid-cols-1 gap-4 lg:gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIAL_LINKS.map((link, idx) => (
              <CTACard
                key={link.href}
                {...link}
                className={cn(
                  "hover:bg-accent/80",
                  idx === 0 && "lg:rounded-l-3xl lg:rounded-r-none",
                  idx === SOCIAL_LINKS.length - 1 &&
                    "lg:rounded-r-3xl lg:rounded-l-none",
                  idx !== 0 &&
                    idx !== SOCIAL_LINKS.length - 1 &&
                    "lg:rounded-none",
                )}
              />
            ))}
          </div>

          {/* {buttons && <SanityButtons buttons={buttons} className="mt-8" />} */}
        </div>
      </div>
    </section>
  );
}
