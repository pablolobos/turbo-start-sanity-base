import {
  BlogCard,
  BlogHeader,
  FeaturedBlogCard,
} from "@/components/blog-card";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchBlogPosts() {
  return await sanityFetch({
    query: queryBlogIndexPageData,
  });
}

export async function generateMetadata() {
  const { data } = await fetchBlogPosts();
  if (!data) return getMetaData({});
  return getMetaData(data);
}

export default async function BlogIndexPage() {
  const { data } = await fetchBlogPosts();
  if (!data) return null;
  const { featuredBlog, blogs, title, description } = data ?? {};

  return (
    <div className="bg-white py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlogHeader title={title} description={description} />
        <div className="mx-auto mt-8 sm:mt-12 md:mt-16 space-y-12 lg:space-y-20">
          {featuredBlog && (
            <div className="w-full">
              <FeaturedBlogCard blog={featuredBlog} />
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
            {blogs.map((blog, index) => (
              <BlogCard key={`${blog._id}-${index}`} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
