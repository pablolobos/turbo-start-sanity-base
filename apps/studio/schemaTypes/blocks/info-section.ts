import { defineField, defineType } from 'sanity'
import { AlignJustify } from 'lucide-react'

export const infoSection = defineType({
    name: 'infoSection',
    title: 'Info Section',
    type: 'object',
    icon: AlignJustify,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The heading text for this section',
            validation: (Rule) => Rule.required().error('A title is required for the info section'),
        }),
        defineField({
            name: 'headingLevel',
            title: 'Heading Level',
            type: 'string',
            description: 'Select the heading hierarchy level',
            options: {
                list: [
                    { title: 'H1', value: 'h1' },
                    { title: 'H2', value: 'h2' },
                    { title: 'H3', value: 'h3' },
                    { title: 'H4', value: 'h4' },
                ],
                layout: 'radio',
            },
            initialValue: 'h2',
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'The main content text with rich text formatting options',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            level: 'headingLevel',
        },
        prepare({ title, level }) {
            return {
                title: title || 'Untitled Info Section',
                subtitle: `Heading Level: ${level?.toUpperCase() || 'H2'}`,
            }
        },
    },
}) 