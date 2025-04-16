import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const imageGallery = defineType({
    name: 'imageGallery',
    title: 'Image Gallery',
    type: 'object',
    icon: ImagesIcon,
    groups: [
        {
            name: 'content',
            title: 'Content',
            icon: ImagesIcon,
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
            description: 'Optional title for the gallery',
        }),
        defineField({
            name: 'description',
            type: 'text',
            group: 'content',
            description: 'Optional description for the gallery',
        }),
        defineField({
            name: 'images',
            type: 'array',
            group: 'content',
            of: [{ type: 'galleryImage' }],
            validation: (rule) => rule.required().min(1).error('At least one image is required'),
        }),
        defineField({
            name: 'layout',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Grid', value: 'grid' },
                    { title: 'Carousel', value: 'carousel' },
                    { title: 'Masonry', value: 'masonry' },
                    { title: 'Bento', value: 'bento' },
                ],
                layout: 'radio',
            },
            initialValue: 'grid',
            description: 'Grid: Standard grid layout | Carousel: Slideshow | Masonry: Pinterest-style varying heights | Bento: Two images on top, one wide image below',
        }),
        defineField({
            name: 'columns',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: '2', value: '2' },
                    { title: '3', value: '3' },
                    { title: '4', value: '4' },
                ],
                layout: 'radio',
            },
            initialValue: '3',
            hidden: ({ parent }) => parent?.layout === 'carousel',
        }),
        defineField({
            name: 'slidesPerRow',
            title: 'Slides Per Row',
            type: 'number',
            group: 'settings',
            options: {
                list: [
                    { title: '1', value: 1 },
                    { title: '2', value: 2 },
                    { title: '3', value: 3 },
                    { title: '4', value: 4 },
                    { title: '5', value: 5 },
                ],
                layout: 'radio',
            },
            initialValue: 3,
            hidden: ({ parent }) => parent?.layout !== 'carousel',
            description: 'Number of slides to show in a row on large screens',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'images.0.image',
            imagesCount: 'images.length',
            layout: 'layout',
        },
        prepare({ title, media, imagesCount, layout }) {
            return {
                title: title || 'Image Gallery',
                subtitle: `${imagesCount || 0} image${imagesCount !== 1 ? 's' : ''} • ${layout || 'grid'} layout`,
                media: media || ImagesIcon,
            }
        },
    },
}) 