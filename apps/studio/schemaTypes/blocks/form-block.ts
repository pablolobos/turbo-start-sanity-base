import { defineField, defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export const formBlock = defineType({
    name: 'formBlock',
    title: 'Formulario',
    type: 'object',
    icon: ComposeIcon,
    preview: {
        select: {
            title: 'title',
            subtitle: 'form.title',
        },
        prepare({ title, subtitle }) {
            return {
                title: title || 'Bloque de Formulario',
                subtitle: subtitle ? `Formulario: ${subtitle}` : 'No se ha seleccionado formulario',
            }
        },
    },
    fields: [
        defineField({
            name: 'title',
            title: 'Título del Bloque',
            type: 'string',
            description: 'Título opcional para mostrar sobre el formulario',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            description: 'Descripción opcional para mostrar sobre el formulario',
        }),
        defineField({
            name: 'form',
            title: 'Formulario',
            type: 'reference',
            to: [{ type: 'formularios' }],
            validation: (Rule) => Rule.required().error('Debes seleccionar un formulario'),
        }),
        defineField({
            name: 'variant',
            title: 'Variante',
            type: 'string',
            options: {
                list: [
                    { title: 'Por defecto', value: 'default' },
                    { title: 'Con fondo', value: 'withBackground' },
                    { title: 'Centrado', value: 'centered' },
                ],
                layout: 'radio',
            },
            initialValue: 'default',
        }),
    ],
}) 