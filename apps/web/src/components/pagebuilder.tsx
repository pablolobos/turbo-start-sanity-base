"use client";
import { useOptimistic } from "@sanity/visual-editing/react";
import { useState, useEffect } from "react";
import { createDataAttribute, type SanityDocument } from "next-sanity";

import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";

import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";
import { ImageGallery } from "./sections/image-gallery";
import { ImageLinkCards } from "./sections/image-link-cards";
import { MainHeroBlock } from "./sections/main-hero";
import { DoubleHeroBlock } from "./sections/double-hero";
import { SubscribeNewsletter } from "./sections/subscribe-newsletter";
import FormBlock from "./sections/form-block";
import { TabsBlock } from "./sections/tabs";
import { InfoSection } from "./sections/info-section";
import { SpecificationsTable } from "./sections/specifications-table";
import { FeaturedBlogs } from "./sections/featured-blogs";
import { HighlightedAspects } from "./sections/highlighted-aspects";
import { ProductListing } from "./sections/product-listing";
import { VideoBlock } from "./sections/video-block";
import { VideoHeroBlock } from "./sections/video-hero";
import { GenericTable } from "./sections/generic-table";

type PageBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

export type PageBuilderProps = {
  pageBuilder: PageBlock[];
  id: string;
  type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBlock[];
};

const BLOCK_COMPONENTS = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  doubleHero: DoubleHeroBlock,
  mainHero: MainHeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  imageGallery: ImageGallery,
  formBlock: FormBlock,
  tabs: TabsBlock,
  infoSection: InfoSection,
  specificationsTable: SpecificationsTable,
  genericTable: GenericTable,
  featuredBlogs: FeaturedBlogs,
  highlightedAspects: HighlightedAspects,
  productListing: ProductListing,
  videoBlock: VideoBlock,
  videoHero: VideoHeroBlock,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

// Sanitize function to clean data of invalid characters
function sanitizeBlockData(block: PageBlock): PageBlock {
  return JSON.parse(
    JSON.stringify(block, (key, value) => {
      if (typeof value === 'string') {
        // Remove zero-width spaces and other invisible characters
        return value.replace(/[\u200B-\u200D\uFEFF]/g, '');
      }
      return value;
    })
  );
}

// Render a component based on its type
function renderBlock(block: PageBlock, id: string, type: string) {
  // Sanitize the block data
  const sanitizedBlock = sanitizeBlockData(block);

  // Safety check for block type
  if (!sanitizedBlock._type || !(sanitizedBlock._type in BLOCK_COMPONENTS)) {
    return (
      <div
        key={sanitizedBlock._key || 'unknown'}
        className="flex justify-center items-center bg-muted p-8 rounded-lg text-muted-foreground text-center"
      >
        Component not found for block type: <code>{sanitizedBlock._type}</code>
      </div>
    );
  }

  const blockType = sanitizedBlock._type as BlockType;
  const Component = BLOCK_COMPONENTS[blockType];

  return (
    <div
      key={sanitizedBlock._key}
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: `pageBuilder[_key=="${sanitizedBlock._key}"]`,
      }).toString()}
      className="group/component"
    >
      {/* @ts-ignore - The typing is complex due to the dynamic nature */}
      <Component {...sanitizedBlock} />
    </div>
  );
}

export function PageBuilder({
  pageBuilder: initialPageBuilder = [],
  id,
  type,
}: PageBuilderProps) {
  // Store the pageBuilder blocks in state for non-optimistic fallback
  const [blocks, setBlocks] = useState<PageBlock[]>(initialPageBuilder);
  const [mounted, setMounted] = useState(false);

  // Always call useOptimistic regardless of mounted state to maintain hook order
  // This fixes the React Hook order error
  const [optimisticBlocks] = useOptimistic<PageBlock[], SanityDocument<PageData>>(
    initialPageBuilder,
    (currentPageBuilder, action) => {
      if (action.id === id && action.document.pageBuilder) {
        return action.document.pageBuilder;
      }
      return currentPageBuilder;
    }
  );

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update blocks when initialPageBuilder changes
  useEffect(() => {
    setBlocks(initialPageBuilder);
  }, [initialPageBuilder]);

  // Choose which blocks to render based on mounted state
  const blocksToRender = mounted && Array.isArray(optimisticBlocks)
    ? optimisticBlocks
    : blocks;

  return (
    <main
      className="flex flex-col"
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: "pageBuilder",
      }).toString()}
    >
      {blocksToRender.map(block => renderBlock(block, id, type))}
    </main>
  );
}
