import Link from "next/link";

import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";

import { SanityImage } from "./sanity-image";

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number];

interface BlogImageProps {
  image: Blog["image"];
  title?: string | null;
}

function BlogImage({ image, title }: BlogImageProps) {
  if (!image?.asset) return null;

  return (
    <SanityImage
      asset={image}
      width={800}
      height={400}
      alt={title ?? "Blog post image"}
      className="bg-gray-100 rounded-none w-full object-cover aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2]"
    />
  );
}

interface AuthorImageProps {
  author: Blog["authors"];
}

function AuthorImage({ author }: AuthorImageProps) {
  if (!author?.image) return null;

  return (
    <SanityImage
      asset={author.image}
      width={40}
      height={40}
      alt={author.name ?? "Author image"}
      className="flex-none bg-gray-50 rounded-full size-8"
    />
  );
}

interface BlogAuthorProps {
  author: Blog["authors"];
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  if (!author) return null;

  return (
    <div className="flex items-center gap-x-2.5 font-semibold text-gray-900 text-sm/6">
      <AuthorImage author={author} />
      {author.name}
    </div>
  );
}

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'heading4';
}

function BlogMeta({ publishedAt }: { publishedAt: string | null }) {
  return (
    <div className="flex items-center gap-x-4 my-1 text-sm">
      <time dateTime={publishedAt ?? ""} className="text-muted-foreground">
        {publishedAt
          ? new Date(publishedAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          : ""}
      </time>
    </div>
  );
}

function BlogContent({
  title,
  slug,
  description,
  isFeatured,
  headingClass,
}: {
  title: string | null;
  slug: string | null;
  description: string | null;
  isFeatured?: boolean;
  headingClass?: string;
}) {
  const HeadingTag = isFeatured ? "h2" : "h3";
  const headingClasses = headingClass
    ? ` ${headingClass}`
    : isFeatured
      ? "heading-1"
      : "heading-2";

  return (
    <div className="group relative grid grid-rows-subgrid row-span-2">
      <HeadingTag className={headingClasses}>
        <Link href={slug ?? "#"}>
          <span className="absolute inset-0" />
          {title}
        </Link>
      </HeadingTag>
      <p className="text-muted-foreground text-base leading-6">
        {description}
      </p>
    </div>
  );
}

function AuthorSection({ authors }: { authors: Blog["authors"] }) {
  if (!authors) return null;

  return (
    <div className="flex mt-6 pt-6 border-gray-900/5 border-t">
      <div className="relative flex items-center gap-x-4">
        <AuthorImage author={authors} />
        <div className="text-sm leading-6">
          <p className="font-semibold">
            <span className="absolute inset-0" />
            {authors.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FeaturedBlogCard({ blog }: BlogCardProps) {
  const { title, publishedAt, slug, authors, description, image } = blog ?? {};

  return (
    <article className="relative shadow-lg rounded-none w-full overflow-hidden component-height">
      <div className="relative h-full">
        <div className="z-10 absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="w-full">
          <BlogImage image={image} title={title} />
        </div>
        <div className="z-20 absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {publishedAt && (
            <div className="mb-2">
              <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold text-white text-xs">
                {new Date(publishedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          <h2 className="font-bold text-white text-2xl md:text-3xl">
            <Link href={slug ?? "#"}>
              <span className="z-10 absolute inset-0" />
              {title}
            </Link>
          </h2>

          <p className="mt-2 text-white/80 text-base line-clamp-2">
            {description}
          </p>

          {authors && (
            <div className="flex items-center gap-x-2 mt-4">
              <AuthorImage author={authors} />
              <span className="font-medium text-white text-sm">
                {authors.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  if (!blog) {
    return (
      <article className="gap-4 grid grid-cols-1 w-full">
        <div className="bg-muted rounded-none h-48 animate-pulse" />
        <div className="space-y-2">
          <div className="bg-muted rounded w-24 h-4 animate-pulse" />
          <div className="bg-muted rounded w-full h-6 animate-pulse" />
          <div className="bg-muted rounded w-3/4 h-4 animate-pulse" />
        </div>
      </article>
    );
  }

  const { title, publishedAt, slug, authors, description, image } = blog;
  const headingClass = variant === 'heading4' ? 'heading-4' : undefined;

  return (
    <article className="content-start gap-2 grid grid-cols-1 grid-rows-[auto_auto_1fr_1fr] w-full">
      <div className="relative rounded-none w-full h-auto aspect-[16/9] overflow-hidden">
        <BlogImage image={image} title={title} />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
      </div>
      <div className="content-start grid grid-rows-subgrid row-span-3 w-full">
        <BlogMeta publishedAt={publishedAt} />
        <BlogContent
          title={title}
          slug={slug}
          description={description}
          headingClass={headingClass}
        />
        <AuthorSection authors={authors} />
      </div>
    </article>
  );
}

export function BlogHeader({
  title,
  description,
}: {
  title: string | null;
  description: string | null;
}) {
  return (
    <div className="mx-auto px-6 lg:px-8 max-w-7xl">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-bold text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-4 text-muted-foreground text-lg leading-8">
          {description}
        </p>
      </div>
    </div>
  );
}
