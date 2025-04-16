import { notFound } from "next/navigation";

import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { handleErrors } from "@/utils";
import { TitleDescriptionBlock } from "@/components/title-description-block";
type Blog = Parameters<typeof BlogCard>[0]["blog"];

async function fetchBlogPosts() {
  return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
}

export async function generateMetadata() {
  const result = await sanityFetch({ query: queryBlogIndexPageData });
  return await getMetaData(result?.data ?? {});
}

export default async function BlogIndexPage() {
  const [res, err] = await fetchBlogPosts();
  if (err || !res?.data) notFound();

  const {
    blogs = [],
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    displayFeaturedBlogs,
    featuredBlogsCount,
  } = res.data;

  const validFeaturedBlogsCount = featuredBlogsCount
    ? Number.parseInt(featuredBlogsCount)
    : 0;

  if (!blogs.length) {
    return (
      <main className="mx-auto my-16 px-4 md:px-6 container">
        <BlogHeader title={title} description={description} />
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No blog posts available at the moment.
          </p>
        </div>
        {pageBuilder && pageBuilder.length > 0 && (
          <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
        )}
      </main>
    );
  }

  const shouldDisplayFeaturedBlogs =
    displayFeaturedBlogs && validFeaturedBlogsCount > 0;

  const featuredBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(0, validFeaturedBlogsCount)
    : [];
  const remainingBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(validFeaturedBlogsCount)
    : blogs;

  return (
    <main className="bg-background">
      <div className="mx-auto my-16 padding-center max-container">
        {(title || description) && (
          <div className="mb-8">
            <TitleDescriptionBlock
              title={title || ""}
              description={description || ""}
              variant="center"
              headingLevel="h1"
            />
          </div>
        )}

        {featuredBlogs.length > 0 && (
          <div className={`grid-gap grid ${featuredBlogs.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} mx-auto mt-8 sm:mt-12 md:mt-16 mb-8 lg:mb-12`}>
            {featuredBlogs.map((blog: Blog) => (
              <FeaturedBlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {remainingBlogs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 grid-gap mt-8">
            {remainingBlogs.map((blog: Blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}
    </main>
  );
}
