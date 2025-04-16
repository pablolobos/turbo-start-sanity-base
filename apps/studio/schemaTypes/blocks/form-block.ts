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
            displayMode: 'displayMode',
            buttonPosition: 'buttonPosition',
        },
        prepare({ title, subtitle, displayMode, buttonPosition }) {
            let displayInfo = '';
            if (displayMode === 'modal') {
                displayInfo = ` (Modal${buttonPosition === 'fixed' ? ', Botón fijo' : ''})`;
            }

            return {
                title: title || 'Bloque de Formulario',
                subtitle: subtitle
                    ? `Formulario: ${subtitle}${displayInfo}`
                    : 'No se ha seleccionado formulario',
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
            name: 'displayMode',
            title: 'Modo de visualización',
            type: 'string',
            description: 'Define si el formulario se muestra directamente en la página o dentro de un modal',
            options: {
                list: [
                    { title: 'Integrado en página', value: 'inline' },
                    { title: 'Usar modal', value: 'modal' },
                ],
                layout: 'radio',
            },
            initialValue: 'inline',
        }),
        defineField({
            name: 'triggerText',
            title: 'Texto del botón',
            type: 'string',
            description: 'Texto para el botón que abrirá el modal',
            hidden: ({ parent }) => parent?.displayMode !== 'modal',
            validation: (Rule) => Rule.custom((value, context: any) => {
                if (context.parent?.displayMode === 'modal' && !value) {
                    return 'El texto del botón es obligatorio cuando se usa un modal'
                }
                return true
            }),
        }),
        defineField({
            name: 'buttonPosition',
            title: 'Posición del botón',
            type: 'string',
            description: 'Define si el botón estará en línea con el contenido o fijo en la pantalla',
            options: {
                list: [
                    { title: 'En línea con el contenido', value: 'default' },
                    { title: 'Fijo en pantalla', value: 'fixed' },
                ],
                layout: 'radio',
            },
            hidden: ({ parent }) => parent?.displayMode !== 'modal',
            initialValue: 'default',
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