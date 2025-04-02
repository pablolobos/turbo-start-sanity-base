import type { Metadata } from "next";

import type { Maybe } from "@/types";
import { capitalize } from "@/utils";

import { getBaseUrl } from "../config";
import { client } from "./sanity/client";
import { queryGlobalSeoSettings } from "./sanity/query";

interface MetaDataInput {
  _type?: Maybe<string>;
  _id?: Maybe<string>;
  seoTitle?: Maybe<string>;
  seoDescription?: Maybe<string>;
  title?: Maybe<string>;
  description?: Maybe<string>;
  slug?: Maybe<string> | { current: Maybe<string> };
}

function getOgImage({ type, id }: { type?: string; id?: string } = {}): string {
  const params = new URLSearchParams();
  if (id) params.set("id", id);
  if (type) params.set("type", type);
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/og?${params.toString()}`;
}

export async function getMetaData(data: MetaDataInput = {}): Promise<Metadata> {
  const { _type, seoDescription, seoTitle, slug, title, description, _id } =
    data ?? {};

  // Fetch global SEO settings
  const globalSettings = await client.fetch(queryGlobalSeoSettings);
  const { siteTitle, siteDescription, socialLinks } = globalSettings || {};

  const baseUrl = getBaseUrl();
  const pageSlug = typeof slug === "string" ? slug : (slug?.current ?? "");
  const pageUrl = `${baseUrl}${pageSlug}`;

  const placeholderTitle = capitalize(pageSlug);

  const twitterHandle = socialLinks?.twitter
    ? `@${socialLinks.twitter.split("/").pop()}`
    : "@studioroboto";

  const meta = {
    title: `${seoTitle ?? title ?? placeholderTitle}`,
    description: seoDescription ?? description ?? siteDescription ?? "",
  };

  const ogImage = getOgImage({
    type: _type ?? undefined,
    id: _id ?? undefined,
  });

  // Use siteTitle from settings for branding, with a fallback only if settings are not available
  const brandName = siteTitle || "Roboto Studio Demo";

  return {
    title: `${meta.title} | ${brandName}`,
    description: meta.description,
    metadataBase: new URL(baseUrl),
    creator: brandName,
    authors: [{ name: brandName }],
    icons: {
      icon: [
        { url: `${baseUrl}/icon?id=16`, sizes: '16x16', type: 'image/png' },
        { url: `${baseUrl}/icon?id=32`, sizes: '32x32', type: 'image/png' },
        { url: `${baseUrl}/icon?id=48`, sizes: '48x48', type: 'image/png' },
        { url: `${baseUrl}/icon?id=180`, sizes: '180x180', type: 'image/png' },
        { url: `${baseUrl}/icon?id=192`, sizes: '192x192', type: 'image/png' },
        { url: `${baseUrl}/icon?id=512`, sizes: '512x512', type: 'image/png' }
      ],
      apple: { url: `${baseUrl}/icon?id=180`, sizes: '180x180', type: 'image/png' },
      shortcut: { url: `${baseUrl}/icon?id=32` }
    },
    keywords: [
      "Volvo",
      "Volvo Chile",
      "Volvo Camiones",
      "Volvo Buses",
      "Volvo Motores",
      "Volvo Motores Penta"
    ],
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      creator: twitterHandle,
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      countryName: "UK",
      description: meta.description,
      title: meta.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };
}
