import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { TableOfContent } from "@/components/table-of-content";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogSlugPageData } from "@/lib/sanity/query";

async function fetchBlogSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryBlogSlugPageData,
    params: { slug: `/blog/${slug}` },
  });
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchBlogSlugPageData(slug);
  if (!data) return null;

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <header className="mb-8">
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {data.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {data.description}
            </p>
          </header>
          {data.image && (
            <div className="mb-12">
              <SanityImage
                asset={data.image}
                alt="Decorative geometric pattern"
                width={800}
                loading="eager"
                height={400}
                className="rounded-lg bg-muted"
              />
            </div>
          )}
          <RichText richText={data.richText} />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-4 rounded-lg ">
            <TableOfContent richText={data.richText} />
          </div>
        </aside>
      </div>
    </div>
  );
}
