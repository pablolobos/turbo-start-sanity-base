import { ObjectDefinition } from 'sanity'
import { cta } from "./cta"
import { doubleHero } from "./double-hero"
import { faqAccordion } from "./faq-accordion"
import { featureCardsIcon } from "./feature-cards-icon"
import { formBlock } from "./form-block"
import { hero } from "./hero"
import { imageGallery } from "./image-gallery"
import { imageLinkCards } from "./image-link-cards"
import { mainHero } from "./main-hero"
import { specificationsTable } from "./specifications-table"
import { subscribeNewsletter } from "./subscribe-newsletter"

// Base blocks without tabs to avoid circular dependency
export const baseBlocks: ObjectDefinition[] = [
    mainHero,
    hero,
    doubleHero,
    cta,
    featureCardsIcon,
    faqAccordion,
    imageLinkCards,
    imageGallery,
    subscribeNewsletter,
    formBlock,
    specificationsTable,
]; 