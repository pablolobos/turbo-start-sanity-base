import { defineField, defineType } from 'sanity'
import { Sparkles } from 'lucide-react'
import { customRichText } from '../definitions/rich-text'
import type { ValidationContext } from 'sanity'

type AspectParent = {
    variant?: 'image' | 'icon' | 'none'
}

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
                            name: 'variant',
                            title: 'Variante',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Imagen', value: 'image' },
                                    { title: 'Ícono', value: 'icon' },
                                    { title: 'Ninguno', value: 'none' }
                                ],
                                layout: 'radio'
                            },
                            initialValue: 'image'
                        }),
                        defineField({
                            name: 'image',
                            title: 'Imagen',
                            type: 'image',
                            options: {
                                hotspot: true,
                                accept: 'image/svg+xml,image/*'
                            },
                            hidden: ({ parent }: { parent: AspectParent }) => parent?.variant === 'none',
                            validation: rule => rule.custom((value, context: ValidationContext) => {
                                const parent = context.parent as AspectParent
                                if ((parent?.variant === 'image' || parent?.variant === 'icon') && !value) {
                                    return 'La imagen es obligatoria cuando se selecciona la variante Imagen o Ícono'
                                }
                                return true
                            })
                        }),
                        customRichText(['block'], {
                            name: 'content',
                            title: 'Contenido'
                        })
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            media: 'image',
                            variant: 'variant'
                        },
                        prepare({ title, media, variant }) {
                            return {
                                title: title || 'Aspecto sin título',
                                media: variant !== 'none' ? media : undefined,
                                subtitle: variant === 'icon' ? 'Variante: Ícono' : variant === 'none' ? 'Sin imagen' : undefined
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
            aspects: 'aspects'
        },
        prepare({ title, aspects = [] }) {
            const aspectsCount = aspects?.length || 0
            return {
                title: title || 'Aspectos Destacados',
                subtitle: `${aspectsCount} aspecto${aspectsCount !== 1 ? 's' : ''} destacado${aspectsCount !== 1 ? 's' : ''}`,
                media: Sparkles
            }
        }
    }
}) 