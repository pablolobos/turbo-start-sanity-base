import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import { HeroBlock } from "./sections/hero";
import { CTABlock } from "./sections/cta";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { FaqAccordion } from "./sections/faq-accordion";

export type PageBuilderProps = {
  pageBuilder: NonNullable<QueryHomePageDataResult>["pageBuilder"];
};

export function PageBuilder({ pageBuilder }: PageBuilderProps) {
  if (!pageBuilder) return null;

  return (
    <main className="flex flex-col gap-16 my-16">
      {pageBuilder.map((block, index) => {
        switch (block?._type) {
          case "hero":
            return <HeroBlock key={block?._key} {...block} />;
          case "cta":
            return <CTABlock key={block?._key} {...block} />;
          case "featureCardsIcon":
            return (
              <FeatureCardsWithIcon key={block?._key} {...block} />
            );
          case "faqAccordion":
            return <FaqAccordion key={block?._key} {...block} />;
          default:
            return (
              <div
                key={`${index}-${(block as unknown as { _key: string })._key}`}
              >
                Block not found:{" "}
                {(block as unknown as { _type: string })._type}
              </div>
            );
        }
      })}
    </main>
  );
}

