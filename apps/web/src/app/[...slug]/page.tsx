import { PageBuilder } from "@/components/pagebuilder";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  querySlugPageData,
  querySlugPagePaths,
} from "@/lib/sanity/query";
import { notFound } from "next/navigation";

async function fetchSlugPageData(slug: string) {
  return await sanityFetch({
    query: querySlugPageData,
    params: { slug: `/${slug}` },
  });
}

async function fetchSlugPagePaths() {
  const slugs = await client.fetch(querySlugPagePaths);
  const paths: { slug: string[] }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const parts = slug.split("/").filter(Boolean);
    paths.push({ slug: parts });
  }
  return paths;
}

export async function generateStaticParams() {
  return await fetchSlugPagePaths();
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString);

  if (!pageData) {
    return notFound();
  }

  return <PageBuilder pageBuilder={pageData.pageBuilder} />;
}
