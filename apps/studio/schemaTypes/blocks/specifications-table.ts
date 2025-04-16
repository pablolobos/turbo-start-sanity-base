import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const specificationsTable = defineType({
    name: 'specificationsTable',
    title: 'Specifications Table',
    type: 'object',
    icon: DocumentIcon,
    groups: [
        {
            name: 'content',
            title: 'Content',
            icon: DocumentIcon,
            default: true,
        },
        {
            name: 'settings',
            title: 'Settings',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            group: 'content',
            description: 'Title for the specifications table',
        }),
        defineField({
            name: 'description',
            type: 'text',
            group: 'content',
            description: 'Optional description for the specifications table',
        }),
        defineField({
            name: 'specifications',
            type: 'array',
            group: 'content',
            of: [{ type: 'specificationItem' }],
            validation: (rule) => rule.required().min(1).error('At least one specification is required'),
        }),
        defineField({
            name: 'variant',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Default', value: 'default' },
                    { title: 'Striped', value: 'striped' },
                    { title: 'Bordered', value: 'bordered' },
                    { title: 'Compact', value: 'compact' },
                ],
                layout: 'radio',
            },
            initialValue: 'default',
            description: 'Choose the visual style of the specifications table',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            specCount: 'specifications.length',
        },
        prepare({ title, specCount }) {
            return {
                title: title || 'Specifications Table',
                subtitle: `${specCount || 0} specification${specCount !== 1 ? 's' : ''}`,
                media: DocumentIcon,
            }
        },
    },
}) 