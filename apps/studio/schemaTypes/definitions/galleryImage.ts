import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const galleryImage = defineType({
    name: 'galleryImage',
    title: 'Gallery Image',
    type: 'object',
    icon: ImageIcon,
    fields: [
        defineField({
            name: 'image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required().error('An image is required'),
        }),
        defineField({
            name: 'alt',
            type: 'string',
            description: 'Alternative text for screen readers',
            validation: (rule) => rule.required().error('Alt text is required for accessibility'),
        }),
        defineField({
            name: 'caption',
            type: 'string',
            description: 'Optional caption to display with the image',
        }),
    ],
    preview: {
        select: {
            title: 'caption',
            subtitle: 'alt',
            media: 'image',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Untitled Image',
                subtitle: subtitle,
                media: media,
            }
        },
    },
}) 