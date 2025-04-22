import { defineField, defineType } from 'sanity'
import { GraduationCap } from 'lucide-react'

export const cursosBlock = defineType({
    name: 'cursosBlock',
    title: 'Bloque de Cursos',
    type: 'object',
    icon: GraduationCap,
    groups: [
        {
            name: 'content',
            title: 'Contenido',
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
            description: 'Título opcional para el bloque de cursos',
            group: 'content',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            description: 'Descripción opcional para el bloque de cursos',
            group: 'content',
        }),
        defineField({
            name: 'cursos',
            title: 'Cursos',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'cursos' }],
                }
            ],
            validation: (Rule) => Rule.required().min(1).error('Selecciona al menos un curso'),
            description: 'Selecciona uno o más cursos para mostrar',
            group: 'content',
        }),
        defineField({
            name: 'displayMode',
            title: 'Modo de visualización',
            type: 'string',
            options: {
                list: [
                    { title: 'Grid', value: 'grid' },
                    { title: 'Lista', value: 'list' },
                ],
                layout: 'radio',
            },
            initialValue: 'grid',
            group: 'settings',
        }),
        defineField({
            name: 'showAllDates',
            title: 'Mostrar todas las fechas',
            type: 'string',
            options: {
                list: [
                    { title: 'Sí', value: 'yes' },
                    { title: 'No', value: 'no' },
                ],
                layout: 'radio',
            },
            description: 'Si selecciona "No", solo se mostrarán las próximas fechas',
            initialValue: 'no',
            group: 'settings',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            cursos: 'cursos',
        },
        prepare({ title, cursos = [] }) {
            return {
                title: title || 'Bloque de Cursos',
                subtitle: `${cursos.length} curso${cursos.length === 1 ? '' : 's'} seleccionado${cursos.length === 1 ? '' : 's'}`,
                media: GraduationCap,
            }
        },
    },
}) 