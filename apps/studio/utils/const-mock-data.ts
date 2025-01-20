import { faker } from "@faker-js/faker";
import { capitalize, splitArray } from "./helper";



export const TITLE_EYEBROW_PAIRS = [
  {
    title: "Why We Are Unique",
    eyebrow: "Features & Benefits",
  },
  {
    title: "Our Key Features",
    eyebrow: "What Makes Us Different",
  },
  {
    title: "What Sets Us Apart",
    eyebrow: "Our Expertise",
  },
  {
    title: "Our Core Strengths",
    eyebrow: "Key Differentiators",
  },
  {
    title: "Why Choose Us",
    eyebrow: "Value Proposition",
  },
  {
    title: "Our Advantages",
    eyebrow: "Core Competencies",
  },
  {
    title: "What We Offer",
    eyebrow: "Unique Solutions",
  },
  {
    title: "Our Capabilities",
    eyebrow: "Industry Leadership",
  },
];

export const QUESTIONS = [
  {
    value: faker.helpers.fake(
      "What is {{company.name}}'s return policy?"
    ),
    answer: `
          <p>Our <strong>return policy</strong> allows returns within <em>30 days</em> of purchase with original receipt. Items must be <strong>unused</strong> and in <strong>original packaging</strong>. Refunds are processed within <em>5-7 business days</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How do I track my {{commerce.product}} order?"
    ),
    answer: `
          <p>You can <strong>track your order</strong> by logging into your account and viewing the order status. We also send <em>tracking information</em> via email once your order ships.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What payment methods do you accept for {{commerce.product}}?"
    ),
    answer: `
          <p>We accept all <strong>major credit cards</strong> (<em>Visa</em>, <em>Mastercard</em>, <em>American Express</em>), <strong>PayPal</strong>, and <strong>Apple Pay</strong>. Payment information is securely encrypted.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How long does shipping take to {{location.city}}?"
    ),
    answer: `
          <p><strong>Standard shipping</strong> typically takes <em>3-5 business days</em>. <strong>Express shipping</strong> options are available for <em>1-2 day delivery</em> in most areas.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you offer international shipping to {{location.country}}?"
    ),
    answer: `
          <p>Yes, we offer <strong>international shipping</strong> to most countries. Delivery times vary by location, typically <em>7-14 business days</em>. Additional <strong>customs fees</strong> may apply.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What are your shipping rates to {{location.state}}?"
    ),
    answer: `
          <p><strong>Shipping rates</strong> are calculated based on weight and destination. <strong>Standard shipping</strong> starts at <em>$5.99</em>. <strong>Free shipping</strong> is available for orders over <em>$50</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Why should I choose {{company.buzzPhrase}}?"
    ),
    answer: `
          <p>We offer <strong>industry-leading quality</strong>, <strong>exceptional customer service</strong>, and <strong>competitive pricing</strong>. Our products are backed by a <em>satisfaction guarantee</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What makes your {{commerce.productName}} different from competitors?"
    ),
    answer: `
          <p>Our products feature <strong>premium materials</strong>, <strong>innovative design</strong>, and <strong>rigorous quality testing</strong>. We also provide <em>comprehensive post-purchase support</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you have any {{commerce.productAdjective}} {{commerce.product}} in stock?"
    ),
    answer: `
          <p>Our <strong>inventory</strong> is updated in <em>real-time</em> on our website. You can check <strong>current availability</strong> and set up notifications for <strong>out-of-stock</strong> items.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Can I get a refund on my {{commerce.product}}?"
    ),
    answer: `
          <p>Yes, <strong>refunds</strong> are available within our <em>30-day return window</em>. Contact our <strong>customer service team</strong> to initiate the refund process.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What is your {{company.name}}'s warranty policy?"
    ),
    answer: `
          <p>Our products come with a <strong>comprehensive warranty</strong> that covers <em>manufacturing defects</em> for up to <strong>one year</strong> from the purchase date. Extended warranty options are also available.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How can I contact {{company.name}}'s customer support?"
    ),
    answer: `
          <p>Our <strong>customer support team</strong> is available through multiple channels: <em>live chat</em>, <em>email</em>, and <em>phone</em>. Support hours are <strong>24/7</strong> for your convenience.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What is {{company.name}}'s price match policy?"
    ),
    answer: `
          <p>We offer <strong>price matching</strong> on identical items from authorized retailers. Simply provide proof of the lower price within <em>14 days</em> of your purchase for a <strong>price adjustment</strong>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you offer bulk discounts for {{commerce.product}}?"
    ),
    answer: `
          <p>Yes, we provide <strong>volume discounts</strong> for bulk orders. Discounts start at <em>10% off</em> for orders over $500 and increase based on quantity. Contact our <strong>sales team</strong> for custom quotes.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What is your {{company.name}}'s privacy policy?"
    ),
    answer: `
          <p>We take your privacy seriously. Your <strong>personal information</strong> is securely encrypted and never shared with third parties. View our detailed <em>privacy policy</em> for complete information.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How do I set up my {{commerce.product}} account?"
    ),
    answer: `
          <p>Setting up your account is <strong>quick and simple</strong>. Visit our website, click <em>'Create Account'</em>, and follow the <strong>step-by-step instructions</strong>. Verification is usually completed within minutes.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What loyalty programs does {{company.name}} offer?"
    ),
    answer: `
          <p>Our <strong>rewards program</strong> offers <em>points on every purchase</em>, <strong>exclusive member discounts</strong>, and <strong>early access</strong> to new products and sales. Membership is completely free.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How do I report a defective {{commerce.product}}?"
    ),
    answer: `
          <p>For defective products, please <strong>document the issue</strong> with photos and contact our <em>quality assurance team</em>. We'll provide <strong>immediate assistance</strong> and arrange replacement if needed.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What certifications does {{company.name}} have?"
    ),
    answer: `
          <p>We maintain <strong>ISO 9001 certification</strong> and are <em>industry-certified</em> in all operating regions. Our facilities undergo <strong>regular audits</strong> to ensure compliance with international standards.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you offer custom {{commerce.product}} solutions?"
    ),
    answer: `
          <p>Yes, our <strong>customization team</strong> works directly with clients to develop <em>tailored solutions</em>. We offer <strong>flexible customization options</strong> to meet specific requirements and preferences.</p>
        `,
  },
];

export const BUTTON_TEXT = [
  "Learn More",
  "Get Started",
  "Contact Us",
  "Sign Up Now",
  "Try It Free",
  "Book a Demo",
  "Join Today",
  "Explore More",
  "Get Access",
  "Schedule Call",
  "View Details",
  "Download Now",
  "Request Info",
  "Start Free Trial",
  "See Pricing",
  "Talk to Sales",
  "Watch Video",
  "Read Case Study",
  "Subscribe",
  "Register Now",
];

export function generatePageTitle() {
  const length = faker.number.int({ min: 40, max: 80 });
  const names = Array.from({ length }, () => {
    const adjective = capitalize(
      faker.company.catchPhraseAdjective()
    );
    const descriptor = capitalize(
      faker.company.catchPhraseDescriptor()
    );
    const noun = capitalize(faker.company.catchPhraseNoun());
    return `${adjective} ${descriptor} ${noun}`;
  });
  return faker.helpers.arrayElement(names);
}

export const BADGES = [
  "New Release",
  "Hot Deal",
  "Limited Time Offer",
  "Exclusive Access",
  "Special Offer",
];

export function generateButtons() {
  const url = "https://robotostudio.com?ref=template-sanity";
  return [
    {
      _key: faker.string.uuid(),
      _type: "button",
      text: faker.helpers.arrayElement(BUTTON_TEXT),
      url: {
        _type: "customUrl",
        type: "external",
        href: url,
        openInNewTab: faker.datatype.boolean(),
        external: url,
      },
      variant: "default",
    },
    {
      _key: faker.string.uuid(),
      _type: "button",
      text: faker.helpers.arrayElement(BUTTON_TEXT),
      url: {
        _type: "customUrl",
        type: "external",
        href: url,
        openInNewTab: faker.datatype.boolean(),
        external: url,
      },
      variant: "secondary",
    },
  ];
}

export const MOCK_ICONS = [
  {
    _type: "iconPicker",
    name: "anchor",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>',
  },
];

type Link = {
  id?: string;
  name: string;
};

export function generateNavbarColumns({ links }: { links: Link[] }) {
  const [firstPart, secondPart] = splitArray(links, 2);
  const buildLinks = (links: Link[]) => {
    return links.map((link) => ({
      _key: faker.string.uuid(),
      _type: "navbarColumnLink",
      description: faker.lorem.paragraph(),
      icon: faker.helpers.arrayElement(MOCK_ICONS),
      name: link.name,
      url: {
        _type: "customUrl",
        href: "#",
        external: link.id ? undefined : "https://example.com",
        internal: link.id
          ? {
              _ref: link.id,
              _type: "reference",
            }
          : undefined,
        openInNewTab: !link.id,
        type: link.id ? "internal" : "external",
      },
    }));
  };
  return [
    {
      _key: faker.string.uuid(),
      _type: "navbarLink",
      name: "Blogs",
      url: {
        _type: "customUrl",
        href: "#",
        internal: {
          _ref: "blogIndex",
          _type: "reference",
        },
        openInNewTab: false,
        type: "internal",
      },
    },
    {
      _key: faker.string.uuid(),
      _type: "navbarLink",
      name: "Pricing",
      url: {
        _type: "customUrl",
        external: "https://example.com",
        href: "#",
        openInNewTab: false,
        type: "external",
      },
    },
    {
      _key: faker.string.uuid(),
      _type: "navbarColumn",
      links: buildLinks(firstPart),
      title: "Resources",
    },
    {
      _key: faker.string.uuid(),
      _type: "navbarColumn",
      links: buildLinks(secondPart),
      title: "Products",
    },
  ];
}

export function generateFooterColumns({ links }: { links: Link[] }) {
  const [firstPart, secondPart, thirdPart] = splitArray(links, 3);
  const buildLinks = (links: Link[]) => {
    return links.map((link) => ({
      _key: faker.string.uuid(),
      _type: "footerColumnLink",
      name: link.name,
      url: {
        _type: "customUrl",
        external: link.id ? undefined : "https://example.com",
        internal: link.id
          ? {
              _ref: link.id,
              _type: "reference",
            }
          : undefined,
        href: "#",
        openInNewTab: !link.id,
        type: link.id ? "internal" : "external",
      },
    }));
  };

  return [
    {
      _key: faker.string.uuid(),
      _type: "footerColumn",
      links: buildLinks(firstPart),
      title: "Product",
    },
    {
      _key: faker.string.uuid(),
      _type: "footerColumn",
      links: buildLinks(secondPart),
      title: "Company",
    },
    {
      _key: faker.string.uuid(),
      _type: "footerColumn",
      links: buildLinks(thirdPart),
      title: "Resources",
    },
  ];
}

type NavbarColumns = ReturnType<typeof generateNavbarColumns>;
type FooterColumns = ReturnType<typeof generateFooterColumns>;

export const getMockNavbarData = ({
  columns,
}: {
  columns: NavbarColumns;
}) => {
  return {
    _id: "navbar",
    _type: "navbar",
    buttons: generateButtons(),
    columns,
    label: "Navbar",
  };
};

export function generateMockFooterData({
  columns,
}: {
  columns: FooterColumns;
}) {
  return {
    _id: "footer",
    _type: "footer",
    _createdAt: "2025-01-17T11:55:54Z",
    label: "Footer",
    columns,
    subtitle:
      "Powered by Next.js and Sanity, crafted in a seamless monorepo architecture.",
  };
}

export function generateGlobalSettingsData(logoImageId?: string) {
  return {
    _id: "settings",
    _type: "settings",
    contactEmail: "hello@roboto.studio",
    label: "Settings",
    logo: logoImageId
      ? {
          _type: "image",
          asset: {
            _ref: logoImageId,
            _type: "reference",
          },
        }
      : undefined,
    siteDescription:
      "Powered by Next.js and Sanity, crafted in a seamless monorepo architecture.",
    siteTitle: "Template Robot Next Sanity",
    socialLinks: {
      linkedin: "https://uk.linkedin.com/company/robotostudio",
      twitter: "https://x.com/studioroboto",
      youtube: "https://www.youtube.com/@robotostudio",
    },
  };
}