import { defineField, defineType } from 'sanity'
import { Wrench } from 'lucide-react'
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { pageBuilderField } from "../common";
import { GROUP, GROUPS } from "../../utils/constant";

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
    groups: GROUPS,
    fields: [
        orderRankField({ type: "repuestos" }),
        defineField({
            name: 'title',
            title: 'Nombre del repuesto',
            type: 'string',
            group: GROUP.MAIN_CONTENT,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: GROUP.MAIN_CONTENT,
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
            group: GROUP.MAIN_CONTENT,
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Imagen",
            group: GROUP.MAIN_CONTENT,
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
            group: GROUP.MAIN_CONTENT,
            options: {
                list: categories.map(category => ({ title: category, value: category })),
            },
            validation: (Rule) => Rule.required(),
        }),
        pageBuilderField,
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