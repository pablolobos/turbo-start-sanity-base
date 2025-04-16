import { notFound } from "next/navigation";
import type { PortableTextBlock } from "next-sanity";

import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { TableOfContent } from "@/components/table-of-content";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogPaths, queryBlogSlugPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchBlogSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryBlogSlugPageData,
    params: { slug: `/noticias/${slug}` },
  });
}

async function fetchBlogPaths() {
  const slugs = await client.fetch(queryBlogPaths);
  const paths: { slug: string }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const [, , path] = slug.split("/");
    if (path) paths.push({ slug: path });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchBlogSlugPageData(slug);
  return await getMetaData(data ?? {});
}

export async function generateStaticParams() {
  return await fetchBlogPaths();
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchBlogSlugPageData(slug);
  if (!data) return notFound();
  const { title, description, image, richText } = data ?? {};

  // Cast richText to RichText type
  const typedRichText: PortableTextBlock[] | undefined = richText as
    | PortableTextBlock[]
    | undefined;

  return (
    <div className="mx-auto padding-center max-container">
      <div className="gap-8 grid grid-cols-1">
        <main className="flex flex-col gap-8 py-8 lg:py-16">
          <header className="flex flex-col gap-4 mb-8">
            <h1 className="heading-1">{title}</h1>
            <p className="mt-4 text-muted-foreground text-xl">{description}</p>
          </header>
          {image && (
            <div className="mb-12 w-full h-[300px] lg:h-[500px] bg-accent-brand">
              <SanityImage
                asset={image}
                alt={title}
                loading="eager"
                priority
                className="rounded-none w-full h-full object-cover"
              />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] grid-gap">
            <RichText richText={richText ?? []} />
            <aside className="hidden lg:block">
              <div className="top-[100px] sticky rounded-lg">
                <TableOfContent richText={typedRichText} />
              </div>
            </aside>
          </div>
        </main>

      </div>
    </div>
  );
}
