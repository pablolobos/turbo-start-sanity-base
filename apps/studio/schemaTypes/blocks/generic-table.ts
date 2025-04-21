import { defineField, defineType } from 'sanity'
import { Grid3X3 } from 'lucide-react'

export const genericTable = defineType({
    name: 'genericTable',
    title: 'Tabla Genérica',
    type: 'object',
    icon: Grid3X3,
    groups: [
        {
            name: 'content',
            title: 'Contenido',
            icon: Grid3X3,
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
            description: 'Título para la tabla',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            group: 'content',
            description: 'Descripción opcional para la tabla',
        }),
        defineField({
            name: 'columnCount',
            title: 'Número de Columnas',
            type: 'number',
            group: 'settings',
            options: {
                list: [
                    { title: '3 Columnas', value: 3 },
                    { title: '4 Columnas', value: 4 },
                    { title: '5 Columnas', value: 5 },
                    { title: '6 Columnas', value: 6 },
                ],
                layout: 'radio',
            },
            initialValue: 4,
            validation: (rule) => rule.required().error('Debe seleccionar el número de columnas'),
        }),
        defineField({
            name: 'columnHeaders',
            title: 'Encabezados de Columna',
            type: 'array',
            group: 'content',
            of: [
                defineField({
                    type: 'string',
                    name: 'header',
                    validation: (rule) => rule.required().error('El encabezado es requerido'),
                }),
            ],
            validation: (rule) =>
                rule.required()
                    .min(3)
                    .max(6)
                    .error('Debe tener entre 3 y 6 encabezados'),
        }),
        defineField({
            name: 'rows',
            title: 'Filas',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'object',
                    name: 'row',
                    fields: [
                        defineField({
                            name: 'cells',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'cell',
                                    fields: [
                                        defineField({
                                            name: 'content',
                                            type: 'string',
                                            title: 'Contenido',
                                        }),
                                        defineField({
                                            name: 'isLastColumn',
                                            type: 'boolean',
                                            initialValue: false,
                                            hidden: true,
                                        }),
                                    ],
                                },
                                {
                                    type: 'object',
                                    name: 'richCell',
                                    fields: [
                                        defineField({
                                            name: 'content',
                                            type: 'richText',
                                            title: 'Contenido Rico',
                                        }),
                                        defineField({
                                            name: 'isLastColumn',
                                            type: 'boolean',
                                            initialValue: true,
                                            hidden: true,
                                        }),
                                    ],
                                },
                            ],
                            validation: (rule) =>
                                rule.required()
                                    .min(3)
                                    .max(6)
                                    .error('Cada fila debe tener entre 3 y 6 celdas'),
                        }),
                    ],
                    preview: {
                        select: {
                            cells: 'cells',
                        },
                        prepare({ cells }) {
                            const firstCell = cells?.[0]?.content || 'Fila sin contenido'
                            return {
                                title: firstCell,
                                subtitle: `${cells?.length || 0} celdas`,
                            }
                        },
                    },
                },
            ],
            validation: (rule) => rule.required().min(1).error('Se requiere al menos una fila'),
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
            description: 'Elija el estilo visual de la tabla',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            rows: 'rows',
            columnCount: 'columnCount',
        },
        prepare({ title, rows = [], columnCount }) {
            return {
                title: title || 'Tabla Genérica',
                subtitle: `${columnCount} columnas, ${rows.length} fila${rows.length !== 1 ? 's' : ''}`,
                media: Grid3X3,
            }
        },
    },
}) 