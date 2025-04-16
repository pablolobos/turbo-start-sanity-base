import { NewspaperIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featuredBlogs = defineType({
    name: "featuredBlogs",
    title: "Featured Blogs",
    type: "object",
    icon: NewspaperIcon,
    description: "Display a curated selection of blog posts or latest blog posts",
    preview: {
        select: {
            title: "title",
            subtitle: "subtitle",
            blogCount: "blogCount",
            displayMode: "displayMode",
        },
        prepare({ title, subtitle, blogCount, displayMode }) {
            return {
                title: title || "Featured Blogs",
                subtitle: `${displayMode === "curated" ? "Curated" : "Latest"} blogs (${blogCount || 3})`,
                media: NewspaperIcon,
            };
        },
    },
    fields: [
        defineField({
            name: "title",
            title: "Title",
            description: "The main heading shown above the featured blogs section",
            type: "string",
        }),
        defineField({
            name: "subtitle",
            title: "Subtitle",
            description: "Optional text shown below the title",
            type: "string",
        }),
        defineField({
            name: "displayMode",
            title: "Display Mode",
            description: "Choose whether to show the latest blogs or manually select blogs",
            type: "string",
            options: {
                list: [
                    { title: "Latest blogs", value: "latest" },
                    { title: "Curated selection", value: "curated" },
                ],
                layout: "radio",
            },
            initialValue: "latest",
        }),
        defineField({
            name: "blogCount",
            title: "Number of Blogs",
            description: "Select how many blogs to display (when using latest mode)",
            type: "string",
            options: {
                list: [
                    { title: "1", value: "1" },
                    { title: "2", value: "2" },
                    { title: "3", value: "3" },
                ],
                layout: "radio",
                direction: "horizontal",
            },
            initialValue: "3",
            hidden: ({ parent }) => parent?.displayMode !== "latest",
        }),
        defineField({
            name: "blogs",
            title: "Selected Blogs",
            description: "Choose which blogs to feature in this section",
            type: "array",
            of: [
                defineArrayMember({
                    type: "reference",
                    to: [{ type: "blog" }],
                    options: {
                        disableNew: true,
                    },
                }),
            ],
            validation: (Rule) => [
                Rule.custom((blogs, context) => {
                    const { parent } = context as { parent: { displayMode: string } };
                    if (parent?.displayMode === "curated" && (!blogs || blogs.length === 0)) {
                        return "Please select at least one blog when using curated mode";
                    }
                    if (parent?.displayMode === "curated" && blogs && blogs.length > 3) {
                        return "You can select a maximum of 3 blogs";
                    }
                    return true;
                }),
            ],
            hidden: ({ parent }) => parent?.displayMode !== "curated",
        }),
        defineField({
            name: "showViewAllButton",
            title: "Show View All Button",
            description: "Display a button to navigate to the blog listing page",
            type: "string",
            options: {
                list: [
                    { title: "Yes", value: "yes" },
                    { title: "No", value: "no" },
                ],
                layout: "radio",
            },
            initialValue: "yes",
        }),
        defineField({
            name: "buttonText",
            title: "Button Text",
            description: "Text to display on the view all button",
            type: "string",
            initialValue: "View all articles",
            hidden: ({ parent }) => parent?.showViewAllButton !== "yes",
        }),
    ],
}); 