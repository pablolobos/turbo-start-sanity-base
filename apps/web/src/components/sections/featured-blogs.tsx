import Link from "next/link";

import { BlogCard, FeaturedBlogCard } from "@/components/blog-card";
import { TitleDescriptionBlock } from "@/components/title-description-block";
import { SanityButtons } from "@/components/sanity-buttons";
import type { SanityButtonProps } from "@/types";

export interface FeaturedBlogsProps {
    _type: string;
    _key: string;
    title?: string | null;
    subtitle?: string | null;
    blogs?: any[];
    displayMode?: string;
    blogCount?: string;
    showViewAllButton?: boolean;
    buttonText?: string;
}

export function FeaturedBlogs(props: FeaturedBlogsProps) {
    const {
        title,
        subtitle,
        blogs = [],
        displayMode = "latest",
        blogCount = "3",
        showViewAllButton = true,
        buttonText = "View all articles",
    } = props;

    // If no blogs, don't render the component
    if (!blogs || blogs.length === 0) return null;

    // Get the limited blogs
    const count = typeof blogCount === 'string' ? parseInt(blogCount, 10) : 3;
    const limitedBlogs = displayMode === "latest"
        ? blogs.slice(0, count)
        : blogs;

    // Create a viewAll button for SanityButtons
    const viewAllButton: SanityButtonProps[] | null = showViewAllButton ? [
        {
            _key: "view-all-button",
            _type: "button",
            text: buttonText,
            href: "/noticias",
            variant: "outline",
            icon: "volvo-chevron-right",
            openInNewTab: false
        }
    ] : null;

    return (
        <section className="bg-background py-16 md:py-24">
            <div className="flex flex-col gap-8 mx-auto padding-center max-container">
                {/* Title and subtitle area */}
                {(title || subtitle) && (
                    <div className="mb-12">
                        <TitleDescriptionBlock
                            title={title || ""}
                            description={subtitle || ""}
                            variant="center"
                            headingLevel="h2"
                        />
                    </div>
                )}

                {/* Blog layout depends on how many blogs to display */}
                {limitedBlogs.length === 1 && limitedBlogs[0] && (
                    // Single featured blog (full width)
                    <div className="mb-8 w-full">
                        <FeaturedBlogCard blog={limitedBlogs[0]} />
                    </div>
                )}

                {limitedBlogs.length === 2 && (
                    // Two blogs side by side on larger screens
                    <div className="grid grid-cols-1 md:grid-cols-2 grid-gap mb-8">
                        {limitedBlogs.map((blog) => blog && (
                            <BlogCard key={blog._id} blog={blog} variant="heading4" />
                        ))}
                    </div>
                )}

                {limitedBlogs.length >= 3 && (
                    // Three blogs in a grid layout
                    <div className="grid grid-cols-1 md:grid-cols-3 grid-gap mb-8">
                        {limitedBlogs.slice(0, 3).map((blog) => blog && (
                            <BlogCard key={blog._id} blog={blog} variant="heading4" />
                        ))}
                    </div>
                )}

                {/* Optional "View All" button */}
                {showViewAllButton && (
                    <div className="flex justify-center mt-8">
                        <SanityButtons
                            buttons={viewAllButton}
                            className="justify-center"
                        />
                    </div>
                )}
            </div>
        </section>
    );
} 