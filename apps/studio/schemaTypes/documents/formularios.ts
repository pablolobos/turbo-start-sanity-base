import { defineField, defineType, defineArrayMember } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const formulariosType = defineType({
    name: 'formularios',
    title: 'Formularios',
    type: 'document',
    icon: DocumentTextIcon,
    description: 'Configuración de formularios de contacto',
    groups: [
        {
            name: 'general',
            title: 'General',
            default: true,
        },
        {
            name: 'fields',
            title: 'Campos del Formulario',
        },
        {
            name: 'settings',
            title: 'Configuración',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Título del Formulario',
            type: 'string',
            description: 'Nombre identificador del formulario',
            validation: (Rule) => Rule.required().error('El título es obligatorio'),
            group: 'general',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL amigable para identificar el formulario',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required().error('El slug es obligatorio'),
            group: 'general',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            description: 'Breve descripción del propósito del formulario',
            group: 'general',
        }),
        defineField({
            name: 'fields',
            title: 'Campos del Formulario',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'field',
                    title: 'Campo',
                    preview: {
                        select: {
                            title: 'label',
                            subtitle: 'type',
                        },
                    },
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Etiqueta',
                            type: 'string',
                            validation: (Rule) => Rule.required().error('La etiqueta es obligatoria'),
                        }),
                        defineField({
                            name: 'name',
                            title: 'Nombre del Campo',
                            type: 'string',
                            description: 'Identificador único del campo (sin espacios ni caracteres especiales)',
                            validation: (Rule) => Rule.required().error('El nombre del campo es obligatorio'),
                        }),
                        defineField({
                            name: 'type',
                            title: 'Tipo de Campo',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Texto corto', value: 'text' },
                                    { title: 'Texto largo', value: 'textarea' },
                                    { title: 'Email', value: 'email' },
                                    { title: 'Teléfono', value: 'tel' },
                                    { title: 'Número', value: 'number' },
                                    { title: 'Selección', value: 'select' },
                                    { title: 'Radio', value: 'radio' },
                                    { title: 'Checkbox', value: 'checkbox' },
                                ],
                                layout: 'radio',
                            },
                            validation: (Rule) => Rule.required().error('El tipo de campo es obligatorio'),
                        }),
                        defineField({
                            name: 'required',
                            title: 'Obligatorio',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Sí', value: 'yes' },
                                    { title: 'No', value: 'no' },
                                ],
                                layout: 'radio',
                            },
                            initialValue: 'no',
                        }),
                        defineField({
                            name: 'options',
                            title: 'Opciones',
                            type: 'array',
                            of: [defineArrayMember({ type: 'string' })],
                            description: 'Opciones para campos de tipo select o radio',
                            hidden: ({ parent }) => !['select', 'radio'].includes(parent?.type),
                        }),
                        defineField({
                            name: 'placeholder',
                            title: 'Placeholder',
                            type: 'string',
                            description: 'Texto de ayuda que aparece dentro del campo',
                        }),
                    ],
                }),
            ],
            group: 'fields',
        }),
        defineField({
            name: 'submitButtonText',
            title: 'Texto del Botón Enviar',
            type: 'string',
            initialValue: 'Enviar',
            group: 'settings',
        }),
        defineField({
            name: 'successMessage',
            title: 'Mensaje de Éxito',
            type: 'text',
            description: 'Mensaje que se muestra cuando el formulario se envía correctamente',
            initialValue: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
            group: 'settings',
        }),
        defineField({
            name: 'errorMessage',
            title: 'Mensaje de Error',
            type: 'text',
            description: 'Mensaje que se muestra cuando hay un error al enviar el formulario',
            initialValue: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
            group: 'settings',
        }),
        defineField({
            name: 'emailRecipients',
            title: 'Destinatarios de Email',
            type: 'string',
            description: 'Direcciones de correo electrónico que recibirán las notificaciones (separadas por comas)',
            initialValue: 'pablo.lobos@fenomena.cl',
            validation: Rule => Rule.required().error('Debe especificar al menos un destinatario'),
            group: 'settings',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description',
        },
    },
}) 