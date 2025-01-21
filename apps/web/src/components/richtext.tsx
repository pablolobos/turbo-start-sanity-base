import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";
import Link from "next/link";
import { SanityImage } from "./sanity-image";

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="scroll-m-20 text-base font-semibold tracking-tight">
        {children}
      </h6>
    ),
    inline: ({ children }) => <span>{children}</span>,
  },
  marks: {
    customLink: ({ children, value }) => {
      console.log("🚀 ~ value:", value);
      if (!value.href || value.href === "#") {
        console.warn("🚀 link is not set", value);
        return (
          <span className="underline decoration-dotted underline-offset-2">
            Link Broken
          </span>
        );
      }
      return (
        <Link
          className="underline decoration-dotted underline-offset-2"
          href={value.href}
          aria-label={`Link to ${value?.href}`}
          target={value.openInNewTab ? "_blank" : "_self"}
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="">{children}</li>,
    number: ({ children }) => <li className="">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      return (
        <div className="my-4">
          <SanityImage
            asset={value}
            className="w-full h-auto rounded-lg"
            width={1600}
            height={900}
            // priority
          />
        </div>
      );
    },
  },
  hardBreak: () => <br />,
};

export function RichText<T>({ richText }: { richText?: T | null }) {
  if (!richText) return null;

  return (
    <div className="prose prose-slate prose-headings:scroll-m-24 prose-headings:font-bold prose-headings:text-opacity-90 prose-p:text-opacity-80 prose-a:underline prose-a:decoration-dotted prose-ol:list-decimal prose-ol:text-opacity-80 prose-ul:list-disc prose-ul:text-opacity-80 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:first:mt-0 max-w-none">
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
