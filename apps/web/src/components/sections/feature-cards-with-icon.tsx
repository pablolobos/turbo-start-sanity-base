import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityIcon } from "../sanity-icon";

type FeatureCardsWithIconProps = PagebuilderType<"featureCardsIcon">;

type FeatureCardProps = {
  card: NonNullable<FeatureCardsWithIconProps["cards"]>[number];
};

function FeatureCard({ card }: FeatureCardProps) {
  const { icon, title, richText } = card ?? {};
  return (
    <div className="bg-accent p-8 md:p-8 rounded-3xl md:min-h-[300px]">
      <span className="flex justify-center items-center bg-background drop-shadow-xl mb-9 p-3 rounded-full w-fit">
        <SanityIcon icon={icon} />
      </span>

      <div>
        <h3 className="mb-2 font-medium text-lg md:text-2xl">{title}</h3>
        <RichText
          richText={richText}
          className="font-normal text-black/90 md:text-[16px] text-sm text-balance leading-7"
        />
      </div>
    </div>
  );
}

export function FeatureCardsWithIcon({
  eyebrow,
  title,
  richText,
  cards,
}: FeatureCardsWithIconProps) {
  return (
    <section id="features" className="my-6 md:my-16">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="font-semibold text-3xl md:text-5xl">{title}</h2>
            <RichText
              richText={richText}
              className="max-w-3xl text-base md:text-lg text-balance"
            />
          </div>
        </div>
        <div className="gap-8 grid lg:grid-cols-3 mx-auto mt-20">
          {cards?.map((card, index) => (
            <FeatureCard
              key={`FeatureCard-${card?._key}-${index}`}
              card={card}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
