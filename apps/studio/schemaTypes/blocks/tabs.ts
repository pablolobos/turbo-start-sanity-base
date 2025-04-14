import { defineArrayMember, defineField, defineType, ObjectDefinition } from "sanity"
import { AppWindowMac } from "lucide-react"

import { baseBlocks } from "./base-blocks"

interface TabBlock {
    type: string
    name?: string
}

export const tabs: ObjectDefinition = defineType({
    name: "tabs",
    title: "Tabs",
    type: "object",
    icon: AppWindowMac,
    description: "Create a tabbed interface where each tab can contain different content blocks",
    preview: {
        select: {
            title: "title",
            tabs: "tabs"
        },
        prepare({ title, tabs = [] }) {
            return {
                title: title || "Tabs Section",
                subtitle: `${tabs.length} ${tabs.length === 1 ? "tab" : "tabs"}`,
            }
        },
    },
    fields: [
        defineField({
            name: "title",
            type: "string",
            description: "Optional title for the tabs section that appears above the tabs",
        }),
        defineField({
            name: "description",
            type: "text",
            rows: 2,
            description: "Optional description that appears below the title",
        }),
        defineField({
            name: "tabs",
            type: "array",
            description: "Add one or more tabs with content",
            validation: Rule => Rule.required().min(1).error("At least one tab is required"),
            of: [
                defineArrayMember({
                    type: "object",
                    name: "tab",
                    fields: [
                        defineField({
                            name: "label",
                            type: "string",
                            description: "The text shown in the tab button",
                            validation: Rule => Rule.required().error("Tab label is required"),
                        }),
                        defineField({
                            name: "content",
                            type: "array",
                            description: "The content blocks to show when this tab is active",
                            of: baseBlocks.map(block => defineArrayMember(block)),
                            validation: Rule => Rule.required().min(1).error("Tab content is required"),
                        }),
                    ],
                    preview: {
                        select: {
                            label: "label",
                            content: "content",
                        },
                        prepare({ label, content = [] }) {
                            return {
                                title: label || "Untitled Tab",
                                subtitle: `${content.length} ${content.length === 1 ? "block" : "blocks"}`,
                            }
                        },
                    },
                }),
            ],
        }),
    ],
}) 