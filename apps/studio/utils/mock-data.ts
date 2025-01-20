import { faker } from "@faker-js/faker";
import { PromisePool } from "@supercharge/promise-pool";
import type { SanityClient } from "sanity";
import { createFakeBlockContent, parseHTML } from "./parse-body";
import slugify from "slugify";
import {
  BADGES,
  generateButtons,
  generatePageTitle,
  MOCK_ICONS,
  QUESTIONS,
  TITLE_EYEBROW_PAIRS,
} from "./const-mock-data";
import { retryPromise } from "./helper";

type ImageType =
  | "heroBlock"
  | "slugPage"
  | "author"
  | "blog"
  | "logo";

type GenerateImageOptions = {
  width?: number;
  height?: number;
  url?: string;
  category?: string;
  type: ImageType;
};

async function generateImage(
  client: SanityClient,
  { width, height, url, type, category }: GenerateImageOptions
) {
  const imageUrl =
    url ??
    (category === "author"
      ? faker.image.avatar()
      : faker.image.urlPicsumPhotos({
          width: width ?? 800,
          height: height ?? 600,
          blur: 0,
          grayscale: false,
        }));
  const imageBuffer = await fetch(imageUrl).then((res) =>
    res.arrayBuffer()
  );
  const imageAsset = await client.assets.upload(
    "image",
    Buffer.from(imageBuffer),
    {
      title: faker.lorem.words(3),
    }
  );
  return {
    id: imageAsset._id,
    type: type,
  };
}

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

export async function generateAndUploadMockImages(
  client: SanityClient
) {
  const imageAssets = [
    {
      type: "heroBlock" as const,
      width: 1200,
      height: 1200,
    },
    {
      type: "heroBlock" as const,
      width: 1200,
      height: 1200,
    },
    {
      type: "slugPage" as const,
      width: 2560,
      height: 1440,
    },
    {
      type: "slugPage" as const,
      width: 2560,
      height: 1440,
    },
    {
      type: "slugPage" as const,
      width: 2560,
      height: 1440,
    },
    {
      type: "author" as const,
      category: "author",
    },
    {
      type: "author" as const,
      category: "author",
    },
    {
      type: "blog" as const,
      width: 2560,
      height: 1440,
    },
    {
      type: "blog" as const,
      width: 2560,
      height: 1440,
    },
    {
      type: "blog" as const,
      width: 2560,
      height: 1440,
    },
    { type: "logo" as const, url: LOGO_URL },
  ];

  console.log("🎨 Starting image generation...");
  const { results } = await PromisePool.withConcurrency(2)
    .for(imageAssets)
    .process(async (asset, index) => {
      console.log(
        `📸 Generating image ${index + 1}/${imageAssets.length} (${asset.type})`
      );
      return await retryPromise(
        async () => {
          return await generateImage(client, asset);
        },
        {
          onRetry(error, attempt) {
            console.log(
              `🔄 Retrying image generation attempt ${attempt} for ${asset.type}:`,
              error.message
            );
          },
        }
      );
    });
  console.log(`✅ Created ${results.length} images`);

  return results;
}

type ImageStore = Awaited<
  ReturnType<typeof generateAndUploadMockImages>
>;

function generateHeroBlock(
  imagesStore: ImageStore,
  { title }: { title?: string } = {}
) {
  const heroImages = imagesStore.filter(
    (image) => image.type === "heroBlock"
  );
  const heroImage = faker.helpers.arrayElement(heroImages);
  return {
    _key: faker.string.uuid(),
    _type: "hero" as const,
    title: title ?? generatePageTitle(),
    badge: faker.helpers.arrayElement(BADGES),
    image: {
      _type: "image",
      asset: {
        _ref: heroImage.id,
        _type: "reference",
      },
    },
    richText: createFakeBlockContent({
      maxParagraphs: 2,
      minParagraphs: 1,
    }),
    buttons: generateButtons(),
  };
}

function generateCTABlock() {
  return {
    _key: faker.string.uuid(),
    _type: "cta" as const,
    title: generatePageTitle(),
    richText: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
    buttons: generateButtons(),
  };
}

function generateFeatureIconsCard() {
  return Array.from({ length: 4 }).map(() => ({
    _key: faker.string.uuid(),
    _type: "featureCardIcon" as const,
    title: faker.company.catchPhrase(),
    icon: faker.helpers.arrayElement(MOCK_ICONS),
    richText: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
  }));
}
function generateFeatureCardsIconBlock() {
  const selectedPair = faker.helpers.arrayElement(
    TITLE_EYEBROW_PAIRS
  );
  return {
    _key: faker.string.uuid(),
    _type: "featureCardsIcon" as const,
    title: selectedPair.title,
    eyebrow: selectedPair.eyebrow,
    richText: createFakeBlockContent({
      maxParagraphs: 2,
      minParagraphs: 1,
    }),
    cards: generateFeatureIconsCard(),
  };
}

export function generateFAQs({
  min = 5,
  max = 7,
}: {
  min?: number;
  max?: number;
  minParagraphs?: number;
  maxParagraphs?: number;
} = {}) {
  const length = faker.number.int({ min, max });

  const faqs = Array.from({ length }).map(() => {
    const len = faker.number.int({ min: 20, max: 50 });
    const faqsBuffer = Array.from({ length: len }, () =>
      faker.helpers.arrayElement(QUESTIONS)
    );
    const faq = faker.helpers.arrayElement(faqsBuffer);
    return {
      _type: "faq",
      _id: faker.string.uuid(),
      title: faq.value,
      richText: parseHTML(faq.answer),
    };
  });
  return faqs;
}

type Faqs = ReturnType<typeof generateFAQs>;

function generateFAQBlock(faqs: Faqs) {
  return {
    _key: faker.string.uuid(),
    _type: "faqAccordion" as const,
    title: "Frequently Asked Questions",
    subtitle:
      "Find out all the essential details about our platform and how it can serve your needs.",
    faqs: faqs.map((faq) => ({
      _key: faker.string.uuid(),
      _type: "reference",
      _ref: faq._id,
    })),
  };
}

export async function checkIfDataExists(client: SanityClient) {
  const data = await client.fetch(`{
    "homePage": defined(*[_type == 'homePage' && _id == 'homePage'][0]._id),
  }`);
  if (data.homePage) {
    return true;
  }
  return false;
}

export function getMockHomePageData({
  imagesStore,
  faqs,
}: {
  imagesStore: ImageStore;
  faqs: Faqs;
}) {
  const blocks = [
    generateHeroBlock(imagesStore, {
      title: "Welcome to our website",
    }),
    generateCTABlock(),
    generateFeatureCardsIconBlock(),
    generateFAQBlock(faqs),
  ];
  return {
    _id: "homePage",
    _type: "homePage" as const,
    title: "Home Page",
    description: faker.lorem.paragraph(),
    slug: {
      type: "slug" as const,
      current: "/",
    },
    pageBuilder: blocks,
  };
}

export function generateMockSlugPages({
  faqs,
  imagesStore,
}: {
  faqs: Faqs;
  imagesStore: ImageStore;
}) {
  const length = faker.number.int({ min: 2, max: 5 });
  const slugPageImages = imagesStore.filter(
    (image) => image.type === "slugPage"
  );
  return Array.from({ length }).map(() => {
    const image = faker.helpers.arrayElement(slugPageImages);
    const blocks = [
      generateHeroBlock(imagesStore),
      generateCTABlock(),
      generateFeatureCardsIconBlock(),
      generateFAQBlock(faqs),
    ];

    const title = generatePageTitle();
    return {
      _id: faker.string.uuid(),
      _type: "page" as const,
      title,
      description: faker.lorem.paragraph(),
      image: {
        _type: "image",
        asset: {
          _ref: image.id,
          _type: "reference",
        },
      },
      slug: {
        type: "slug",
        current: `/${slugify(title, {
          lower: true,
          remove: /[^a-zA-Z0-9 ]/g,
        })}`,
      },
      pageBuilder: blocks,
    };
  });
}

export function generateMockAuthors(imagesStore: ImageStore) {
  const length = faker.number.int({ min: 2, max: 5 });

  const authorImages = imagesStore.filter(
    (image) => image.type === "author"
  );
  return Array.from({ length }).map(() => {
    const image = faker.helpers.arrayElement(authorImages);
    return {
      _id: faker.string.uuid(),
      _type: "author",
      name: faker.person.fullName(),
      position: faker.person.jobTitle(),
      bio: faker.person.bio(),
      image: {
        _type: "image",
        asset: {
          _ref: image.id,
          _type: "reference",
        },
      },
    };
  });
}

type Author = ReturnType<typeof generateMockAuthors>[number];

export function generateMockBlogPages({
  imagesStore,
  authors,
}: {
  imagesStore: ImageStore;
  authors: Author[];
}) {
  const length = faker.number.int({ min: 2, max: 5 });
  const blogImages = imagesStore.filter(
    (image) => image.type === "blog"
  );
  return Array.from({ length }).map(() => {
    const title = generatePageTitle();

    const author = faker.helpers.arrayElement(authors);
    const image = faker.helpers.arrayElement(blogImages);

    return {
      _id: faker.string.uuid(),
      _type: "blog" as const,
      title,
      image: {
        _type: "image",
        asset: {
          _ref: image.id,
          _type: "reference",
        },
      },
      publishedAt: new Date(faker.date.past())
        .toISOString()
        .split("T")[0],
      description: faker.lorem.paragraph(),
      slug: {
        type: "slug",
        current: `/blog/${slugify(title, {
          lower: true,
          remove: /[^a-zA-Z0-9 ]/g,
        })}`,
      },
      richText: createFakeBlockContent({
        minParagraphs: 7,
        maxParagraphs: 12,
        rich: true,
      }),
      authors: [
        {
          _key: faker.string.uuid(),
          _type: "reference",
          _ref: author._id,
        },
      ],
    };
  });
}

type Blog = ReturnType<typeof generateMockBlogPages>[number];

export function generateBlogIndexPage(blogs: Blog[]) {
  const featuredBlog = faker.helpers.arrayElement(blogs);
  return {
    _id: "blogIndex" as const,
    _type: "blogIndex" as const,
    title: "Insights & Updates",
    description:
      "Discover our latest blogs, industry insights, and expert perspectives on technology, development, and digital innovation. Stay informed with in-depth analysis and practical guides.",
    slug: {
      type: "slug",
      current: "/blog",
    },
    ...(featuredBlog?._id
      ? {
          featured: [
            {
              _type: "reference",
              _key: faker.string.uuid(),
              _ref: featuredBlog._id,
            },
          ],
        }
      : {}),
  };
}

