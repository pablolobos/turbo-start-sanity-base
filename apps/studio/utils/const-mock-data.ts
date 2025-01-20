import { faker } from "@faker-js/faker";
import { capitalize } from "./helper";

export const MOCK_SVGS = [
  `<svg fill="currentcolor" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" style="width: 1.5em; height: 1em; font-size: 20px;"><path d="M 14.5229 38.0135 C 20.5413 38.0135 25.3954 33.1199 25.4941 27.2199 C 26.3426 26.9042 27.2503 26.7858 28.0001 26.7858 C 28.7499 26.7858 29.6576 26.9042 30.5061 27.2199 C 30.6048 33.1791 35.4589 38.0135 41.4773 38.0135 C 47.1797 38.0135 51.8368 33.6921 52.4090 28.1868 L 54.7569 28.1868 C 55.6452 28.1868 56.0000 27.6540 56.0000 26.9240 L 56.0000 26.1741 C 56.0000 25.4243 55.6452 24.9112 54.7569 24.9112 L 52.2708 24.9112 C 51.2646 19.8993 46.8245 16.0712 41.4773 16.0712 C 36.3468 16.0712 32.0452 19.6033 30.8415 24.3587 C 29.9339 24.0036 28.8683 23.8852 28.0001 23.8852 C 27.1319 23.8852 26.0663 24.0036 25.1586 24.3587 C 23.9353 19.6033 19.6336 16.0712 14.5229 16.0712 C 9.1755 16.0712 4.7358 19.8993 3.7294 24.9112 L 1.2431 24.9112 C .3354 24.9112 0 25.4243 0 26.1741 L 0 26.9240 C 0 27.6540 .3354 28.1868 1.2431 28.1868 L 3.5913 28.1868 C 4.1635 33.6921 8.8203 38.0135 14.5229 38.0135 Z M 14.5229 35.0537 C 10.1029 35.0537 6.5116 31.4821 6.5116 27.0424 C 6.5116 22.6223 10.1029 19.0311 14.5229 19.0311 C 18.9232 19.0311 22.5343 22.6223 22.5343 27.0424 C 22.5343 31.4821 18.9824 35.0537 14.5229 35.0537 Z M 41.4773 35.0537 C 37.0178 35.0537 33.4659 31.4821 33.4659 27.0424 C 33.4659 22.6223 37.0178 19.0311 41.4773 19.0311 C 45.8971 19.0311 49.4885 22.6223 49.4885 27.0424 C 49.4885 31.4821 45.8971 35.0537 41.4773 35.0537 Z"></path></svg>`,
  `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path fill="none" d="M0 0h24v24H0z"></path><path d="M7 2v11h3v9l7-12h-4l4-8z"></path></svg>`,
  `<svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><title></title><path d="M7.533 0a1.816 1.816 0 0 0-1.816 1.816v2.832h11.178c1.043 0 1.888.855 1.888 1.91v8.204h2.906a1.816 1.816 0 0 0 1.817-1.817V1.816A1.816 1.816 0 0 0 21.689 0H7.533zM2.311 5.148A1.816 1.816 0 0 0 .494 6.965V23.09c0 .81.979 1.215 1.55.642l3.749-3.748h10.674a1.816 1.816 0 0 0 1.816-1.816V6.965a1.816 1.816 0 0 0-1.816-1.817H2.31Z"></path></svg>`,
  `<svg fill="currentcolor" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" style="width: 1.5em; height: 1em; font-size: 20px;"><path d="M26,6.85139842 C28.7838328,2.77272553 34.0445029,0 39,0 C46.1797017,0 52,5.82029825 52,13 C52,20.1797017 46.1797017,26 39,26 C34.0445029,26 28.7838328,23.2272745 26,19.1486016 C23.2161672,23.2272745 17.9554971,26 13,26 C5.82029825,26 0,20.1797017 0,13 C0,5.82029825 5.82029825,0 13,0 C17.9554971,0 23.2161672,2.77272553 26,6.85139842 L26,6.85139842 Z M13,20 C17.4753345,20 22,16.2684294 22,13 C22,9.7315706 17.4753345,6 13,6 C9.13400675,6 6,9.13400675 6,13 C6,16.8659932 9.13400675,20 13,20 Z M39,20 C42.8659932,20 46,16.8659932 46,13 C46,9.13400675 42.8659932,6 39,6 C34.5246655,6 30,9.7315706 30,13 C30,16.2684294 34.5246655,20 39,20 Z" transform="translate(2 14)"></path></svg>`,
  `<svg fill="currentcolor" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" style="width: 1.5em; height: 1em; font-size: 20px;"><path d="M 14.5229 38.0135 C 20.5413 38.0135 25.3954 33.1199 25.4941 27.2199 C 26.3426 26.9042 27.2503 26.7858 28.0001 26.7858 C 28.7499 26.7858 29.6576 26.9042 30.5061 27.2199 C 30.6048 33.1791 35.4589 38.0135 41.4773 38.0135 C 47.1797 38.0135 51.8368 33.6921 52.4090 28.1868 L 54.7569 28.1868 C 55.6452 28.1868 56.0000 27.6540 56.0000 26.9240 L 56.0000 26.1741 C 56.0000 25.4243 55.6452 24.9112 54.7569 24.9112 L 52.2708 24.9112 C 51.2646 19.8993 46.8245 16.0712 41.4773 16.0712 C 36.3468 16.0712 32.0452 19.6033 30.8415 24.3587 C 29.9339 24.0036 28.8683 23.8852 28.0001 23.8852 C 27.1319 23.8852 26.0663 24.0036 25.1586 24.3587 C 23.9353 19.6033 19.6336 16.0712 14.5229 16.0712 C 9.1755 16.0712 4.7358 19.8993 3.7294 24.9112 L 1.2431 24.9112 C .3354 24.9112 0 25.4243 0 26.1741 L 0 26.9240 C 0 27.6540 .3354 28.1868 1.2431 28.1868 L 3.5913 28.1868 C 4.1635 33.6921 8.8203 38.0135 14.5229 38.0135 Z M 14.5229 35.0537 C 10.1029 35.0537 6.5116 31.4821 6.5116 27.0424 C 6.5116 22.6223 10.1029 19.0311 14.5229 19.0311 C 18.9232 19.0311 22.5343 22.6223 22.5343 27.0424 C 22.5343 31.4821 18.9824 35.0537 14.5229 35.0537 Z M 41.4773 35.0537 C 37.0178 35.0537 33.4659 31.4821 33.4659 27.0424 C 33.4659 22.6223 37.0178 19.0311 41.4773 19.0311 C 45.8971 19.0311 49.4885 22.6223 49.4885 27.0424 C 49.4885 31.4821 45.8971 35.0537 41.4773 35.0537 Z"></path></svg>`,
  `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>`,
  `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M422.19 109.95L256.21 9.07c-19.91-12.1-44.52-12.1-64.43 0L25.81 109.95c-5.32 3.23-5.29 11.27.06 14.46L224 242.55l198.14-118.14c5.35-3.19 5.38-11.22.05-14.46zm13.84 44.63L240 271.46v223.82c0 12.88 13.39 20.91 24.05 14.43l152.16-92.48c19.68-11.96 31.79-33.94 31.79-57.7v-197.7c0-6.41-6.64-10.43-11.97-7.25zM0 161.83v197.7c0 23.77 12.11 45.74 31.79 57.7l152.16 92.47c10.67 6.48 24.05-1.54 24.05-14.43V271.46L11.97 154.58C6.64 151.4 0 155.42 0 161.83z"></path></svg>`,
  `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M446.2 270.4c-6.2-19-26.9-29.1-46-22.9l-45.4 15.1-30.3-90 45.4-15.1c19.1-6.2 29.1-26.8 23-45.9-6.2-19-26.9-29.1-46-22.9l-45.4 15.1-15.7-47c-6.2-19-26.9-29.1-46-22.9-19.1 6.2-29.1 26.8-23 45.9l15.7 47-93.4 31.2-15.7-47c-6.2-19-26.9-29.1-46-22.9-19.1 6.2-29.1 26.8-23 45.9l15.7 47-45.3 15c-19.1 6.2-29.1 26.8-23 45.9 5 14.5 19.1 24 33.6 24.6 6.8 1 12-1.6 57.7-16.8l30.3 90L78 354.8c-19 6.2-29.1 26.9-23 45.9 5 14.5 19.1 24 33.6 24.6 6.8 1 12-1.6 57.7-16.8l15.7 47c5.9 16.9 24.7 29 46 22.9 19.1-6.2 29.1-26.8 23-45.9l-15.7-47 93.6-31.3 15.7 47c5.9 16.9 24.7 29 46 22.9 19.1-6.2 29.1-26.8 23-45.9l-15.7-47 45.4-15.1c19-6 29.1-26.7 22.9-45.7zm-254.1 47.2l-30.3-90.2 93.5-31.3 30.3 90.2-93.5 31.3z"></path></svg>`,
];

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

export function generateNavbarColumns() {
  return [
    {
      _key: faker.string.uuid(),
      _type: "column",
      type: "column",
    },
  ];
}

type Buttons = ReturnType<typeof generateButtons>;

// export const getMockNavbarData = ({
//   buttons,
//   columns,
// }: {
//   buttons: Buttons;
//   columns: any[];
// }) => {
//   return {
//     _id: "navbar",
//     _type: "navbar",
//     buttons,
//     columns,
//     label: "Navbar",
//   };
// };