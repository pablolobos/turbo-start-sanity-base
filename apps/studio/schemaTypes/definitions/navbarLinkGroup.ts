import { FolderKanban } from "lucide-react";
import { defineField, defineType } from "sanity";

import { navbarColumnLink } from "./navbarColumnLink";

export const navbarLinkGroup = defineType({
    name: "navbarLinkGroup",
    title: "Link Group",
    type: "object",
    icon: FolderKanban,
    description: "A group of related navigation links",
    fields: [
        defineField({
            name: "title",
            type: "string",
            title: "Group Title",
            description: "The heading text displayed above this group of links",
            validation: (rule) => rule.required().error("A group title is required"),
        }),
        defineField({
            name: "links",
            type: "array",
            title: "Group Links",
            description: "The list of navigation links in this group",
            validation: (rule) => [
                rule.required().error("At least one link is required in a group"),
                rule.min(1).error("A group must contain at least one link"),
                rule.unique(),
            ],
            of: [{ type: "navbarColumnLink" }],
        }),
    ],
    preview: {
        select: {
            title: "title",
            links: "links",
        },
        prepare({ title, links = [] }) {
            return {
                title: title || "Untitled Group",
                subtitle: `${links.length} link${links.length === 1 ? "" : "s"}`,
                media: FolderKanban,
            };
        },
    },
}); 