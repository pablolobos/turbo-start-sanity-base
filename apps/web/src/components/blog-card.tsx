import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { SanityImage } from "./sanity-image";

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["featuredBlog"]
>;

const currentDate = new Date();

export function BlogAuthor({ author }: { author: Blog["authors"] }) {
  return (
    <div className="flex items-center gap-x-2.5 text-sm/6 font-semibold text-gray-900">
      {author?.image && (
        <SanityImage
          asset={author?.image}
          alt={author?.name ?? "Author Image"}
          className="size-8 flex-none rounded-full bg-gray-50"
        />
      )}
      {author?.name}
    </div>
  );
}

export function FeaturedBlogCard({ blog }: { blog: Blog }) {
  const { title, publishedAt, slug, authors, description } =
    blog ?? {};
  return (
    <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
      <time
        dateTime={publishedAt ?? currentDate.toISOString()}
        className="block text-sm/6 text-gray-600"
      >
        {new Date(publishedAt ?? currentDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}
      </time>
      <h2
        id="featured-post"
        className="my-4 text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl"
      >
        {title}
      </h2>
      <Badge variant="outline">Featured</Badge>
      <p className="mt-4 text-lg/8 text-gray-600">{description}</p>
      <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
        <div className="flex">
          <Link
            href={slug ?? "#"}
            aria-describedby="featured-post"
            className="text-sm/6 font-semibold text-indigo-600"
          >
            Continue reading <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="flex lg:border-t lg:border-gray-900/10 lg:pt-8">
          <BlogAuthor author={authors} />
        </div>
      </div>
    </article>
  );
}

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="py-12">
      <div className="group relative max-w-xl">
        <time
          dateTime={new Date(
            blog?.publishedAt ?? currentDate
          ).toISOString()}
          className="block text-sm/6 text-gray-600"
        >
          {new Date(
            blog?.publishedAt ?? currentDate
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
          <span className="absolute inset-0" />
          {blog.title}
        </h2>
        <p className="mt-4 text-sm/6 text-gray-600">
          {blog.description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-x-2.5">
        <BlogAuthor author={blog.authors} />
      </div>
      <div className="mt-4">
        <Link
          href={blog.slug ?? "#"}
          aria-describedby="featured-post"
          className="text-sm/6 font-semibold text-indigo-600"
        >
          Continue reading <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
