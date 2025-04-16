import { defineField, defineType } from 'sanity'
import { Sparkles } from 'lucide-react'
import { customRichText } from '../definitions/rich-text'

export const highlightedAspects = defineType({
    name: 'highlightedAspects',
    title: 'Aspectos Destacados',
    type: 'object',
    icon: Sparkles,
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            description: 'Título principal de la sección'
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            description: 'Descripción breve de la sección (opcional)'
        }),
        defineField({
            name: 'aspects',
            title: 'Aspectos',
            type: 'array',
            of: [
                defineField({
                    name: 'aspect',
                    title: 'Aspecto',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Título',
                            type: 'string',
                            validation: rule => rule.required().error('El título es obligatorio')
                        }),
                        defineField({
                            name: 'image',
                            title: 'Imagen',
                            type: 'image',
                            options: {
                                hotspot: true
                            },
                            validation: rule => rule.required().error('La imagen es obligatoria')
                        }),
                        customRichText(['block'], {
                            name: 'content',
                            title: 'Contenido'
                        })
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            media: 'image'
                        },
                        prepare({ title, media }) {
                            return {
                                title: title || 'Aspecto sin título',
                                media
                            }
                        }
                    }
                })
            ],
            validation: rule => rule.required().min(1).error('Debe agregar al menos un aspecto destacado')
        }),
        defineField({
            name: 'columns',
            title: 'Columnas',
            type: 'string',
            options: {
                list: [
                    { title: '2 columnas', value: '2' },
                    { title: '3 columnas', value: '3' },
                    { title: '4 columnas', value: '4' }
                ],
                layout: 'radio'
            },
            initialValue: '3',
            description: 'Número de columnas en la cuadrícula (en pantallas grandes)'
        })
    ],
    preview: {
        select: {
            title: 'title',
            aspectsCount: 'aspects.length'
        },
        prepare({ title, aspectsCount }) {
            return {
                title: title || 'Aspectos Destacados',
                subtitle: `${aspectsCount || 0} aspecto${aspectsCount !== 1 ? 's' : ''} destacado${aspectsCount !== 1 ? 's' : ''}`,
                media: Sparkles
            }
        }
    }
}) 