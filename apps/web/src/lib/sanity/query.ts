import { defineQuery } from "next-sanity";

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
    ${markDefsFragment}
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
    ${tabsBlock}
  }
`;

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment}
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
    ${pageBuilderFragment}
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
    }
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
