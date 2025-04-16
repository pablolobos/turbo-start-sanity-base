import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, Circle } from "lucide-react";
import Link from "next/link";
import type { PortableTextBlock } from "next-sanity";
import { type FC, useMemo } from "react";
import slugify from "slugify";

export type TableProps = {
  richText?: PortableTextBlock[] | null;
};

const headings = {
  h2: "pl-0",
  h3: "pl-4",
  h4: "pl-8",
  h5: "pl-12",
  h6: "pl-16",
};

const extractTextFromBlock = (block: any[]) => {
  return block?.[0]?.text;
};

const styleToNumber = (style: string) => Number(style.replace("h", ""));

const isExistTableOfContent = (richText?: PortableTextBlock[]) => {
  if (Array.isArray(richText)) {
    const even = (text: any) => text.style in headings;
    return richText.filter(even);
  }
  return [];
};

const getHeadingLevels = (exist: any[]) => {
  const temp: any[] = exist.map((block) => {
    return {
      heading: block?.style,
      href: `#${slugify(extractTextFromBlock(block.children), {
        lower: true,
        strict: true,
      })}`,
      head: styleToNumber(block?.style),
      text: extractTextFromBlock(block.children),
    };
  });

  const headings: any[] = [];
  temp.forEach((block, index) => {
    const children = [];

    if (block.isChild) return;

    let count = index + 1;
    while (count < temp.length && block["head"] < temp[count].head) {
      children.push(temp[count]);
      temp[count]["isChild"] = true;
      count++;
    }

    headings.push({
      ...block,
      children,
    });
  });

  return headings;
};

const AnchorT: FC<{ heading: any }> = ({ heading }) => {
  const { href, text, children, isChild, heading: style } = heading ?? {};
  if (isChild === true && children?.length === 0) return <></>;

  return (
    <li
      className={cn("list-inside my-4", [
        headings[style as keyof typeof headings],
        isChild ? "ml-1.5" : "",
      ])}
    >
      <span className="flex items-center gap-2">
        <Circle
          className={cn(
            "min-w-1.5 min-h-1.5 size-1.5 ",
            !isChild && " fill-zinc-900",
          )}
          aria-hidden
        />
        <Link
          href={href ?? "#"}
          className="hover:text-blue-500 hover:underline line-clamp-1"
        >
          {text}
        </Link>
      </span>

      {Array.isArray(children) && children.length > 0 && (
        <ul>
          {children.map((child, index) => (
            <AnchorT heading={child} key={`${child.text}-${index}-${style}`} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const TableOfContent: FC<TableProps> = ({ richText }) => {
  const { showTableOfContent, headings } = useMemo(() => {
    const exist = isExistTableOfContent(richText ?? []);
    if (exist.length) {
      const headings = getHeadingLevels(exist);
      return {
        showTableOfContent: true,
        headings,
      };
    }
    return { showTableOfContent: !!exist.length };
  }, [richText]);

  if (!showTableOfContent) return <></>;

  return (
    <div className="top-8 sticky flex flex-col bg-white p-4 border border-zinc-300 rounded-none w-full max-w-xs">
      <details className="group">
        <summary className="flex justify-between items-center font-semibold text-zinc-800 text-lg cursor-pointer">
          <span>Tabla de contenidos</span>
          <ChevronDown
            className="w-5 h-5 group-open:rotate-180 transition-transform duration-200 transform"
            aria-hidden="true"
          />
        </summary>
        <nav className="mt-4 ml-3" aria-label="Table of contents">
          <ul className="text-sm">
            {Array.isArray(headings) &&
              headings.map((heading, index) => (
                <AnchorT heading={heading} key={`${heading._key}-${index}`} />
              ))}
          </ul>
        </nav>
      </details>
    </div>
  );
};
