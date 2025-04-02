import { LayoutPanelLeft, Link } from "lucide-react";
import { defineField, defineType } from "sanity";

import { iconField } from "../common";

export const navbarColumnLink = defineType({
    name: "navbarColumnLink",
    type: "object",
    icon: LayoutPanelLeft,
    title: "Navigation Column Link",
    description: "A link within a navigation column",
    fields: [
        iconField,
        defineField({
            name: "name",
            type: "string",
            title: "Link Text",
            description: "The text that will be displayed for this navigation link",
        }),
        defineField({
            name: "description",
            type: "string",
            title: "Description",
            description: "The description for this navigation link",
        }),
        defineField({
            name: "url",
            type: "customUrl",
            title: "Link URL",
            description: "The URL that this link will navigate to when clicked",
        }),
    ],
    preview: {
        select: {
            title: "name",
            externalUrl: "url.external",
            urlType: "url.type",
            internalUrl: "url.internal.slug.current",
            openInNewTab: "url.openInNewTab",
        },
        prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
            const url = urlType === "external" ? externalUrl : internalUrl;
            const newTabIndicator = openInNewTab ? " ↗" : "";
            const truncatedUrl =
                url?.length > 30 ? `${url.substring(0, 30)}...` : url;

            return {
                title: title || "Untitled Link",
                subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
                media: Link,
            };
        },
    },
}); 