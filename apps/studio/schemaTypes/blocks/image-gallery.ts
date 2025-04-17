import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

type LayoutType = 'grid' | 'carousel' | 'masonry' | 'bento'

export const imageGallery = defineType({
    name: 'imageGallery',
    title: 'Galería de Imágenes',
    type: 'object',
    icon: ImagesIcon,
    groups: [
        {
            name: 'content',
            title: 'Contenido',
            icon: ImagesIcon,
            default: true,
        },
        {
            name: 'settings',
            title: 'Configuración',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            group: 'content',
            description: 'Título opcional para la galería',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            group: 'content',
            description: 'Descripción opcional para la galería',
        }),
        defineField({
            name: 'images',
            title: 'Imágenes',
            type: 'array',
            group: 'content',
            of: [{ type: 'galleryImage' }],
            validation: (rule) => rule.required().min(1).error('Se requiere al menos una imagen'),
        }),
        defineField({
            name: 'layout',
            title: 'Diseño',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Cuadrícula', value: 'grid' },
                    { title: 'Carrusel', value: 'carousel' },
                    { title: 'Mosaico', value: 'masonry' },
                    { title: 'Bento', value: 'bento' },
                ],
                layout: 'radio',
            },
            initialValue: 'grid',
            description: 'Cuadrícula: Diseño estándar | Carrusel: Presentación de diapositivas | Mosaico: Estilo Pinterest | Bento: Dos imágenes arriba, una imagen ancha abajo',
        }),
        defineField({
            name: 'columns',
            title: 'Columnas',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: '2 columnas', value: '2' },
                    { title: '3 columnas', value: '3' },
                    { title: '4 columnas', value: '4' },
                ],
                layout: 'radio',
            },
            initialValue: '3',
            hidden: ({ parent }) => parent?.layout === 'carousel',
        }),
        defineField({
            name: 'slidesPerRow',
            title: 'Diapositivas por Fila',
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
            description: 'Número de diapositivas a mostrar en una fila en pantallas grandes',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'images.0.image',
            layout: 'layout',
        },
        prepare(selection) {
            const { title, media, layout = 'grid' } = selection
            const layoutNames: Record<LayoutType, string> = {
                grid: 'cuadrícula',
                carousel: 'carrusel',
                masonry: 'mosaico',
                bento: 'bento'
            }
            return {
                title: title || 'Galería de Imágenes',
                subtitle: `Diseño: ${layoutNames[layout as LayoutType]}`,
                media: media || ImagesIcon,
            }
        },
    },
}) 