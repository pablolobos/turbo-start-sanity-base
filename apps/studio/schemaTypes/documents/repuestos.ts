import { defineField, defineType } from 'sanity'
import { Wrench } from 'lucide-react'
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

const categories = [
    'Lubricantes y refrigerantes',
    'Filtros',
    'Componentes de la cabina',
    'Frenos',
    'Componentes de la transmisión',
    'Sistema de suspensión',
    'Componentes de conducción',
    'Motor',
    'Componentes eléctricos'
]

export const repuestos = defineType({
    name: 'repuestos',
    title: 'Repuestos',
    type: 'document',
    icon: Wrench,
    orderings: [orderRankOrdering],
    fields: [
        orderRankField({ type: "repuestos" }),
        defineField({
            name: 'title',
            title: 'Nombre del repuesto',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Descripción del repuesto',
            description: 'Ingrese toda la información sobre el repuesto',
            type: 'richText',
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Imagen",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
            options: {
                list: categories.map(category => ({ title: category, value: category })),
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category',
            media: 'image',
        },
        prepare({ title, category, media }) {
            return {
                title,
                subtitle: category,
                media,
            }
        },
    },
}) 