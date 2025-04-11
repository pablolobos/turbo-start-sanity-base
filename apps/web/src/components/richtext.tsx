import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";

import { parseChildrenToSlug } from "@/utils";

import { SanityImage } from "./sanity-image";

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h2
          id={slug}
          className="first:mt-0 pb-2 border-b font-semibold text-3xl scroll-m-20"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h3 id={slug} className="font-semibold text-2xl scroll-m-20">
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h4 id={slug} className="font-semibold text-xl scroll-m-20">
          {children}
        </h4>
      );
    },
    h5: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h5 id={slug} className="font-semibold text-lg scroll-m-20">
          {children}
        </h5>
      );
    },
    h6: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h6 id={slug} className="font-semibold text-base scroll-m-20">
          {children}
        </h6>
      );
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="bg-opacity-5 p-1 border border-white/10 rounded-md text-sm lg:whitespace-nowrap">
        {children}
      </code>
    ),
    customLink: ({ children, value }) => {
      if (!value.href || value.href === "#") {
        console.warn("🚀 link is not set", value);
        return (
          <span className="decoration-dotted underline underline-offset-2">
            Link Broken
          </span>
        );
      }
      return (
        <Link
          className="decoration-dotted underline underline-offset-2"
          href={value.href}
          prefetch={false}
          aria-label={`Link to ${value?.href}`}
          target={value.openInNewTab ? "_blank" : "_self"}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => (
      <div className="my-4">
        <SanityImage
          asset={value}
          className="rounded-lg w-full h-auto"
          width={1600}
          height={900}
        />
      </div>
    ),
  },
  hardBreak: () => <br />,
};

export function RichText<T>({
  richText,
  className,
}: {
  richText?: T | null;
  className?: string;
}) {
  if (!richText) return null;

  return (
    <div
      className={cn(
        "prose prose-zinc prose-headings:scroll-m-24 prose-headings:text-opacity-90 prose-p:text-opacity-80 prose-a:decoration-dotted prose-ol:text-opacity-80 prose-ul:text-opacity-80 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0 max-w-none",
        className,
      )}
    >
      <PortableText
        value={richText as unknown as PortableTextBlock[]}
        components={components}
        onMissingComponent={(_, { nodeType, type }) =>
          console.log("missing component", nodeType, type)
        }
      />
    </div>
  );
}
