import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

export const textBlock = defineType({
    name: 'textBlock',
    title: 'Text Block',
    type: 'object',
    icon: TextIcon,
    fields: [
        defineField({
            name: 'richText',
            type: 'richText',
            description: 'Add your content using the rich text editor',
        })
    ],
    preview: {
        select: {
            title: 'richText'
        },
        prepare({ title }) {
            return {
                title: 'Text Block',
                subtitle: Array.isArray(title) && title.length > 0 ?
                    title[0]?.children?.[0]?.text || 'No content' : 'No content',
                media: TextIcon
            }
        }
    }
}) 