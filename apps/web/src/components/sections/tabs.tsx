"use client"

import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"


type BlockType = "cta" | "doubleHero" | "faqAccordion" | "featureCardsIcon" | "formBlock" | "hero" | "imageLinkCards" | "mainHero" | "subscribeNewsletter" | "tabs" | "genericTable" | "productListing" | "cursosBlock"
interface TabItem {
    _key: string
    label: string
    content: any[] // Using any[] since the content can be any block type including tabs
}

export type TabsBlockProps = {
    _type: "tabs"
    _key: string
    title?: string
    description?: string
    tabs: TabItem[]
}

// Dynamic import of all possible block components
import { CTABlock } from "./cta"
import { DoubleHeroBlock } from "./double-hero"
import { FaqAccordion } from "./faq-accordion"
import { FeatureCardsWithIcon } from "./feature-cards-with-icon"
import FormBlock from "./form-block"
import { HeroBlock } from "./hero"
import { ImageLinkCards } from "./image-link-cards"
import { MainHeroBlock } from "./main-hero"
import { SubscribeNewsletter } from "./subscribe-newsletter"
import { GenericTable } from "./generic-table"
import { ProductListing } from "./product-listing"
import { CursosBlock } from "./cursos-block"
// Map of block types to their components
const blockComponents = {
    cta: CTABlock,
    doubleHero: DoubleHeroBlock,
    faqAccordion: FaqAccordion,
    featureCardsIcon: FeatureCardsWithIcon,
    formBlock: FormBlock,
    hero: HeroBlock,
    imageLinkCards: ImageLinkCards,
    mainHero: MainHeroBlock,
    subscribeNewsletter: SubscribeNewsletter,
    tabs: TabsBlock,
    genericTable: GenericTable,
    productListing: ProductListing,
    cursosBlock: CursosBlock,
} as const

export function TabsBlock({ title, description, tabs }: TabsBlockProps) {
    return (
        <div className="mx-auto py-12">
            <div className="padding-center max-container">
                {title && (
                    <h2 className="mb-4 font-bold text-3xl sm:text-4xl tracking-tight">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="mb-8 text-muted-foreground text-lg">{description}</p>
                )}
            </div>

            <UITabs defaultValue={tabs[0]?._key} className="w-full section-y-padding-sm">
                <TabsList className="justify-start lg:justify-center bg-transparent mb-8 px-[var(--p-x-sm)] md:px-[var(--p-x-md)] lg:px-[var(--p-x-exterior-lg)] border-b rounded-none w-full overflow-x-auto">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab._key}
                            value={tab._key}
                            className="top-[1px] relative flex-1 data-[state=active]:bg-transparent data-[state=active]:border-foreground border-transparent border-b-2 rounded-none data-[state=active]:font-bold data-[state=active]:text-foreground text-base"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabs.map((tab) => (
                    <TabsContent
                        key={tab._key}
                        value={tab._key}
                        className={cn(
                            "mt-0 focus-visible:outline-none focus-visible:ring-0",
                            "data-[state=active]:animate-in data-[state=active]:fade-in-0",
                            "[&>section:first-of-type]:pt-0"
                        )}
                    >
                        {tab.content?.map((block: any) => {
                            const Component = blockComponents[block._type as BlockType]
                            if (!Component) return null
                            return <Component key={block._key} {...block} />
                        })}
                    </TabsContent>
                ))}
            </UITabs>
        </div>
    )
} 