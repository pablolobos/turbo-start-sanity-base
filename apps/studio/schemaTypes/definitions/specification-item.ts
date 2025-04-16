import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const specificationItem = defineType({
    name: 'specificationItem',
    title: 'Specification Item',
    type: 'object',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'The label for this specification (e.g. "Weight", "Dimensions")',
            validation: (rule) => rule.required().error('Label is required'),
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'The specification content with rich text formatting options',
            validation: (rule) => rule.required().error('Content is required'),
        }),
    ],
    preview: {
        select: {
            title: 'label',
            content: 'content',
        },
        prepare({ title, content }) {
            // Get the first few characters of content for the preview
            const contentPreview = content && content.length > 0 && content[0].children
                ? content[0].children.map((child: { text?: string }) => child.text || '').join(' ').substring(0, 30) + '...'
                : '';

            return {
                title: title || 'Specification Item',
                subtitle: contentPreview,
                media: TagIcon,
            }
        },
    },
}) 