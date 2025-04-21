import { defineQuery } from "next-sanity";
import type { SanityImageCrop, SanityImageHotspot } from "./sanity.types";

// Base fragments for reusable query parts
const imageFragment = `
  image{
    ...,
    "alt": coalesce(asset->altText, asset->originalFilename, "Image-Broken"),
    "blurData": asset->metadata.lqip,
    "dominantColor": asset->metadata.palette.dominant.background,
  }
`;

const customLinkFragment = `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = `
  richText[]{
    ...,
    _type == "button" => {
      ...,
      text,
      variant,
      icon,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    },
    _type == "block" => {
      ...,
      ${markDefsFragment}
    }
  }
`;

const blogAuthorFragment = `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  richText,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

const buttonsFragment = `
  buttons[]{
    text,
    variant,
    icon,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

// Form fragments
const formFieldsFragment = `
  fields[]{
    label,
    name,
    type,
    required,
    options,
    placeholder
  },
  emailRecipients,
  submitButtonText,
  successMessage,
  errorMessage
`;

// Page builder block fragments
const ctaBlock = `
  _type == "cta" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
  }
`;
const imageLinkCardsBlock = `
  _type == "imageLinkCards" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
    "cards": array::compact(cards[]{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      ),
      ${imageFragment},
    })
  }
`;

const heroBlock = `
  _type == "hero" => {
    ...,
    variant,
    titleFont,
    imageAlignment,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const doubleHeroBlock = `
  _type == "doubleHero" => {
    ...,
    variant,
    primaryBadge,
    primaryTitle,
    "primaryRichText": primaryRichText[]{
      ...,
      ${markDefsFragment}
    },
    "primaryImage": primaryImage{
      ...,
      "alt": coalesce(asset->altText, asset->originalFilename, "Primary Image"),
      "blurData": asset->metadata.lqip,
      "dominantColor": asset->metadata.palette.dominant.background,
    },
    primaryButtons[]{
      text,
      variant,
      icon,
      _key,
      _type,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    },
    secondaryBadge,
    secondaryTitle,
    "secondaryRichText": secondaryRichText[]{
      ...,
      ${markDefsFragment}
    },
    "secondaryImage": secondaryImage{
      ...,
      "alt": coalesce(asset->altText, asset->originalFilename, "Secondary Image"),
      "blurData": asset->metadata.lqip,
      "dominantColor": asset->metadata.palette.dominant.background,
    },
    secondaryButtons[]{
      text,
      variant,
      icon,
      _key,
      _type,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const mainHeroBlock = `
  _type == "mainHero" => {
    ...,
    titleFont,
    "backgroundImage": backgroundImage{
      ...,
      "alt": coalesce(asset->altText, asset->originalFilename, "Background Image"),
      "blurData": asset->metadata.lqip,
      "dominantColor": asset->metadata.palette.dominant.background,
    },
    "backgroundVideo": backgroundVideo.asset->url,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const faqFragment = `
  "faqs": array::compact(faqs[]->{
    title,
    _id,
    _type,
    ${richTextFragment}
  })
`;

const faqAccordionBlock = `
  _type == "faqAccordion" => {
    ...,
    ${faqFragment},
    link{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const subscribeNewsletterBlock = `
  _type == "subscribeNewsletter" => {
    ...,
    "subTitle": subTitle[]{
      ...,
      ${markDefsFragment}
    },
    "helperText": helperText[]{
      ...,
      ${markDefsFragment}
    }
  }
`;

const formBlock = `
  _type == "formBlock" => {
    ...,
    title,
    description,
    variant,
    displayMode,
    triggerText,
    buttonPosition,
    "form": form->{
      _id,
      title,
      description,
      ${formFieldsFragment},
      submitButtonText,
      successMessage,
      errorMessage
    }
  }
`;

const imageGalleryBlock = `
  _type == "imageGallery" => {
    ...,
    title,
    description,
    layout,
    columns,
    slidesPerRow,
    "images": images[]{
      ...,
      "image": image{
        ...,
        "alt": coalesce(alt, asset->altText, asset->originalFilename, "Gallery Image"),
        "blurData": asset->metadata.lqip,
        "dominantColor": asset->metadata.palette.dominant.background,
      },
      caption
    }
  }
`;

const specificationsTableBlock = `
  _type == "specificationsTable" => {
    ...,
    title,
    description,
    variant,
    "specifications": specifications[]{
      _key,
      label,
      "content": content[]{
        ...,
        ${markDefsFragment}
      }
    }
  }
`;

const genericTableBlock = `
  _type == "genericTable" => {
    ...,
    title,
    description,
    columnCount,
    columnHeaders,
    rows[]{
      _key,
      cells[]{
        _key,
        content,
        isLastColumn,
        _type == "richCell" => {
          content[]{
            ...,
            ${markDefsFragment}
          }
        }
      }
    },
    variant
  }
`;

const featuredBlogsBlock = `
  _type == "featuredBlogs" => {
    ...,
    title,
    subtitle,
    displayMode,
    blogCount,
    buttonText,
    "showViewAllButton": showViewAllButton == "yes",
    "blogs": select(
      displayMode == "curated" => blogs[]-> {
        ${blogCardFragment}
      },
      displayMode == "latest" => *[
        _type == "blog" 
        && (seoHideFromLists != true)
      ] | order(publishedAt desc, _createdAt desc)[0...3] {
        ${blogCardFragment}
      }
    )
  }
`;

const tabsBlock = `
  _type == "tabs" => {
    ...,
    title,
    description,
    tabs[]{
      _key,
      label,
      content[]{
        ...,
        _type,
        _key,
        ${ctaBlock},
        ${mainHeroBlock},
        ${heroBlock},
        ${doubleHeroBlock},
        ${faqAccordionBlock},
        ${subscribeNewsletterBlock},
        ${imageLinkCardsBlock},
        ${formBlock},
        ${imageGalleryBlock},
        ${featuredBlogsBlock},
        _type == "tabs" => {
          ...,
          title,
          description,
          tabs[]{
            _key,
            label,
            content[]{ 
              ...,
              _type,
              _key
            }
          }
        }
      }
    }
  }
`;

const infoSectionBlock = `
  _type == "infoSection" => {
    ...,
    title,
    headingLevel,
    content[]{
      ...,
      ${markDefsFragment}
    }
  }
`;

// Define a specific fragment for aspect images
const aspectImageFragment = `
  image{
    ...,
    "alt": coalesce(asset->altText, asset->originalFilename, "Aspect Image"),
    "blurData": asset->metadata.lqip,
    "dominantColor": asset->metadata.palette.dominant.background,
  }
`;

// Add a new fragment for the highlighted aspects block
const highlightedAspectsBlock = `
  _type == "highlightedAspects" => {
    title,
    description,
    columns,
    aspects[]{
      _key,
      title,
      variant,
      icon,
      image{
        ...,
        "alt": coalesce(asset->altText, asset->originalFilename, "Aspect Image"),
        "blurData": asset->metadata.lqip,
        "dominantColor": asset->metadata.palette.dominant.background
      },
      content[]{
        ...,
        _type == "button" => {
          ...,
          text,
          variant,
          icon,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        },
        _type == "block" => {
          ...,
          ${markDefsFragment}
        }
      }
    }
  }
`;

const videoBlock = `
  _type == "videoBlock" => {
    ...,
    _key,
    _type,
    title,
    videoType,
    "mp4File": coalesce(
      mp4File.asset->url,
      mp4File.asset->sources[0].url,
      null
    ),
    youtubeUrl,
    showControls,
    autoplay,
    loop,
    allowFullscreen
  }
`;

const videoHeroBlock = `
  _type == "videoHero" => {
    ...,
    variant,
    titleFont,
    videoType,
    "mp4File": coalesce(
      mp4File.asset->url,
      mp4File.asset->sources[0].url,
      null
    ),
    youtubeUrl,
    showControls,
    autoplay,
    loop,
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const pageBuilderFragment = `
  pageBuilder[]{
    ...,
    _type,
    ${ctaBlock},
    ${mainHeroBlock},
    ${heroBlock},
    ${doubleHeroBlock},
    ${faqAccordionBlock},
    ${subscribeNewsletterBlock},
    ${imageLinkCardsBlock},
    ${formBlock},
    ${tabsBlock},
    ${infoSectionBlock},
    ${imageGalleryBlock},
    ${specificationsTableBlock},
    ${genericTableBlock},
    ${featuredBlogsBlock},
    ${highlightedAspectsBlock},
    ${videoBlock},
    ${videoHeroBlock}
  }
`;

// Add this new fragment for category hierarchy
const categoryBreadcrumbFragment = `
  "categoryData": {
    "label": category,
    "slug": category,
    "iri": "/camiones/" + category,
    "parent": null
  }
`;

// Add cotizador settings fragment
const cotizadorSettingsFragment = `
  cotizadorFormTitle,
  cotizadorFormDescription,
  "cotizadorForm": coalesce(cotizadorForm->{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    ${formFieldsFragment}
  }, null)
`;

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment},
    ${categoryBreadcrumbFragment}
  }`);

export const querySlugPageData = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current,
    "blogs": *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc){
      ${blogCardFragment}
    }
  }
`);

export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment},
    ${categoryBreadcrumbFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

const ogFieldsFragment = `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryBlogPageOGData = defineQuery(`
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    subtitle,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        ),
      }
    },
    "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "siteTitle": *[_type == "settings"][0].siteTitle,
    "socialLinks": *[_type == "settings"][0].socialLinks,
  }
`);

export const NAVBAR_QUERY = defineQuery(`*[
  _type == "navbar" 
  && _id == "navbar"
][0]{
  _id,
  columns[]{
    _key,
    _type == "navbarColumn" => {
      "type": "column",
      title,
      links[]{
        _key,
        _type == "navbarColumnLink" => {
          "type": "link",
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        },
        _type == "navbarLinkGroup" => {
          "type": "group",
          title,
          links[]{
            _key,
            name,
            icon,
            description,
            "openInNewTab": url.openInNewTab,
            "href": select(
              url.type == "internal" => url.internal->slug.current,
              url.type == "external" => url.external,
              url.href
            )
          }
        }
      }
    },
    _type == "navbarLink" => {
      "type": "link",
      name,
      description,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  },
  buttons[]{
    text,
    variant,
    icon,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  },
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
  "siteTitle": *[_type == "settings"][0].siteTitle,
}`)

export const querySitemapData = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);

export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    },
    ${cotizadorSettingsFragment}
  }
`);

// Form queries
export const queryAllForms = defineQuery(`*[_type == "formularios"]{
  _id,
  title,
  "slug": slug.current,
  description
}`);

export const queryFormBySlug = defineQuery(`*[
  _type == "formularios" 
  && slug.current == $slug
][0]{
  _id,
  title,
  description,
  ${formFieldsFragment},
  submitButtonText,
  successMessage,
  errorMessage
}`);

// Camiones queries
export const queryCamionesData = defineQuery(`*[_type == "camiones"]{
  _id,
  _type,
  title,
  subtitle,
  description,
  "slug": slug.current,
  ${imageFragment},
  ${richTextFragment},
  "taxonomy": taxonomias->{
    prefLabel,
    conceptId,
    "slug": lower(prefLabel)
  }
}`);

export const queryCamionOrPageBySlug = defineQuery(`*[
  (_type == "camiones" || _type == "page")
  && slug.current == $slug 
][0]{
  _id,
  _type,
  title,
  subtitle,
  description,
  "slug": slug.current,
  _type == "camiones" => { 
    ${imageFragment},
    ${richTextFragment}, 
    taxonomias->{
      "label": prefLabel,
      "slug": prefLabel,
      "iri": "/camiones/" + lower(prefLabel)
    }
  },
  ${pageBuilderFragment} 
}`);

export const queryCamionesPaths = defineQuery(`
  *[_type == "camiones" && defined(slug.current)].slug.current
`);

// Buses queries
export const queryBusesData = defineQuery(`*[_type == "buses"]{
  _id,
  _type,
  title,
  subtitle,
  description,
  "slug": slug.current,
  ${imageFragment},
  ${richTextFragment},
  "taxonomy": taxonomias->{
    prefLabel,
    conceptId,
    "slug": lower(prefLabel)
  }
}`);

export const queryBusOrPageBySlug = defineQuery(`*[
  (_type == "buses" || _type == "page")
  && slug.current == $slug 
][0]{
  _id,
  _type,
  title,
  description,
  "slug": slug.current,
  _type == "buses" => { 
    ${imageFragment},
    ${richTextFragment}, 
    taxonomias->{
      "label": prefLabel,
      "slug": prefLabel,
      "iri": "/buses/" + lower(prefLabel)
    }
  },
  ${pageBuilderFragment} 
}`);

export const queryBusesPaths = defineQuery(`
  *[_type == "buses" && defined(slug.current)].slug.current
`);

// Motores Penta queries
export const queryMotoresPentaData = defineQuery(`*[_type == "motoresPenta"]{
  _id,
  _type,
  title,
  subtitle,
  description,
  "slug": slug.current,
  ${imageFragment},
  ${richTextFragment},
  "taxonomy": taxonomias->{
    prefLabel,
    conceptId,
    "slug": lower(prefLabel)
  }
}`);

export const queryMotorPentaOrPageBySlug = defineQuery(`*[
  (_type == "motoresPenta" || _type == "page")
  && slug.current == $slug 
][0]{
  _id,
  _type,
  title,
  subtitle,
  description,
  "slug": slug.current,
  _type == "motoresPenta" => { 
    ${imageFragment},
    ${richTextFragment}, 
    taxonomias->{
      "label": prefLabel,
      "slug": prefLabel,
      "iri": "/motores-penta/" + lower(prefLabel)
    }
  },
  ${pageBuilderFragment} 
}`);

export const queryMotoresPentaPaths = defineQuery(`
  *[_type == "motoresPenta" && defined(slug.current)].slug.current
`);

// New query for cotizador settings
export const COTIZADOR_SETTINGS_QUERY = defineQuery(`*[
  _type == "settings"
][0]{
  _id,
  ${cotizadorSettingsFragment}
}`);

// New query for a specific cotizador form by ID
export const COTIZADOR_FORM_BY_ID_QUERY = defineQuery(`*[
  _type == "formularios" 
  && _id == $formId
][0]{
  _id,
  title,
  description,
  ${formFieldsFragment}
}`);

// Search Query
export const SEARCH_QUERY = defineQuery(`{
  "results": *[
    _type in ["page", "blog", "camiones", "buses", "motoresPenta"]
    && (
      title match $searchTerm || 
      description match $searchTerm
    )
  ] | order(_createdAt desc) [0...20] {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    "image": image{
      "alt": coalesce(asset->altText, asset->originalFilename, "Image-Broken"),
      "blurData": asset->metadata.lqip,
      "dominantColor": asset->metadata.palette.dominant.background
    },
    "taxonomy": coalesce(taxonomias->{
      prefLabel,
      conceptId
    }, null),
    _createdAt
  }
}`);

export type SEARCH_QUERYResult = {
  results: Array<{
    _id: string;
    _type: "page" | "blog" | "camiones" | "buses" | "motoresPenta";
    title: string | null;
    description: string | null;
    slug: string | null;
    image: {
      alt: string | "Image-Broken";
      blurData: string | null;
      dominantColor: string | null;
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
      };
      media?: unknown;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    } | null;
    taxonomy: {
      prefLabel: string | null;
      conceptId: string | null;
    } | null;
    _createdAt: string;
  }>;
};

export const PRODUCT_LISTING_QUERY = defineQuery(`
  *[
    _type == $productType && 
    taxonomias._ref == $taxonomyId
  ]{
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image {
        "asset": asset->,
        "_type": "image"
    },
    "taxonomy": taxonomias->{
      prefLabel,
      conceptId
    }
  } | order(title asc)
`)

// Query to get available taxonomies for a product type
export const PRODUCT_TAXONOMIES_QUERY = defineQuery(`
  *[_type == "skosConcept" && 
    count(broader[_ref in *[
      _type == "skosConcept" && 
      conceptId == $conceptId
    ]._id]) > 0
  ]{
    prefLabel,
    conceptId,
    _id
  } | order(prefLabel)
`)

// Helper to get the concept ID for each product type
export const PRODUCT_TYPE_CONCEPTS = {
  camiones: "278c9c",
  buses: "cff000",
  motoresPenta: "8d61db"
}

// Product buttons fragment with proper URL resolution
const productButtonsFragment = `
  buttons[]{
    text,
    variant,
    icon,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    )
  }
`;

// Fragment for handling all button types in page builder blocks
const pageBuilderButtonsFragment = `
  _type == "cta" => {
    ...,
    ${buttonsFragment}
  },
  _type == "hero" => {
    ...,
    ${buttonsFragment}
  },
  _type == "mainHero" => {
    ...,
    ${buttonsFragment}
  },
  _type == "videoHero" => {
    ...,
    ${buttonsFragment}
  },
  _type == "imageLinkCards" => {
    ...,
    ${buttonsFragment}
  },
  _type == "doubleHero" => {
    ...,
    "primaryButtons": primaryButtons[]{
      text,
      variant,
      icon,
      _key,
      _type,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    },
    "secondaryButtons": secondaryButtons[]{
      text,
      variant,
      icon,
      _key,
      _type,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

// Product page queries with proper button handling
export const PRODUCT_PAGE_BUILDER_FRAGMENT = `
  "pageBuilder": pageBuilder[]{
    ...,
    _type,
    ${pageBuilderButtonsFragment}
  }
`;

export const CAMION_BY_SLUG_QUERY = defineQuery(`*[_type == "camiones" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  subtitle,
  description,
  image,
  ${PRODUCT_PAGE_BUILDER_FRAGMENT},
  taxonomias,
  slug
}`);

export const BUS_BY_SLUG_QUERY = defineQuery(`*[_type == "buses" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  subtitle,
  description,
  image,
  ${PRODUCT_PAGE_BUILDER_FRAGMENT},
  taxonomias,
  slug
}`);

export const MOTOR_PENTA_BY_SLUG_QUERY = defineQuery(`*[_type == "motoresPenta" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  subtitle,
  description,
  image,
  ${PRODUCT_PAGE_BUILDER_FRAGMENT},
  taxonomias,
  slug
}`);