import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

type FaqAccordionProps = PagebuilderType<"faqAccordion">;

export function FaqAccordion({
  eyebrow,
  title,
  subtitle,
  faqs,
  link,
}: FaqAccordionProps) {
  return (
    <section id="faq" className="my-8">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="font-semibold text-3xl md:text-5xl">{title}</h2>
            <h3 className="font-normal text-[#374151] text-lg text-balance">
              {subtitle}
            </h3>
          </div>
        </div>
        <div className="mx-auto my-16 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="3"
          >
            {faqs?.map((faq, index) => (
              <AccordionItem
                value={faq?._id}
                key={`AccordionItem-${faq?._id}-${index}`}
                className="py-2"
              >
                <AccordionTrigger className="group py-2 text-[15px] hover:no-underline leading-6">
                  {faq?.title}
                </AccordionTrigger>
                <AccordionContent className="pb-2 text-muted-foreground">
                  <RichText
                    richText={faq?.richText ?? []}
                    className="text-sm md:text-base"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {link?.href && (
            <div className="py-6 w-full">
              <p className="mb-1 text-xs">{link?.title}</p>
              <Link
                href={link.href ?? "#"}
                target={link.openInNewTab ? "_blank" : "_self"}
                className="flex items-center gap-2"
              >
                <p className="font-[500] text-[15px] leading-6">
                  {link?.description}
                </p>
                <span className="p-1 border rounded-full">
                  <ArrowUpRight
                    size={16}
                    className="text-[#374151]"
                  />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
