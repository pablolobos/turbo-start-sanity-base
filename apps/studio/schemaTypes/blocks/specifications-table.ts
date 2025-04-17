import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const specificationsTable = defineType({
    name: 'specificationsTable',
    title: 'Tabla de Especificaciones',
    type: 'object',
    icon: DocumentIcon,
    groups: [
        {
            name: 'content',
            title: 'Contenido',
            icon: DocumentIcon,
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
            description: 'Título para la tabla de especificaciones',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            group: 'content',
            description: 'Descripción opcional para la tabla de especificaciones',
        }),
        defineField({
            name: 'specifications',
            title: 'Especificaciones',
            type: 'array',
            group: 'content',
            of: [{ type: 'specificationItem' }],
            validation: (rule) => rule.required().min(1).error('Se requiere al menos una especificación'),
        }),
        defineField({
            name: 'variant',
            title: 'Variante',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Por defecto', value: 'default' },
                    { title: 'Rayada', value: 'striped' },
                    { title: 'Con bordes', value: 'bordered' },
                    { title: 'Compacta', value: 'compact' },
                ],
                layout: 'radio',
            },
            initialValue: 'default',
            description: 'Elija el estilo visual de la tabla de especificaciones',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            specifications: 'specifications',
        },
        prepare({ title, specifications = [] }) {
            const specCount = specifications?.length || 0
            return {
                title: title || 'Tabla de Especificaciones',
                subtitle: `${specCount} especificación${specCount !== 1 ? 'es' : ''}`,
                media: DocumentIcon,
            }
        },
    },
}) 