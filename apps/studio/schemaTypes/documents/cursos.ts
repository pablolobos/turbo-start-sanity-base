import { defineField, defineType } from 'sanity'
import { GraduationCap } from 'lucide-react'

export const cursos = defineType({
    name: 'cursos',
    title: 'Cursos',
    type: 'document',
    icon: GraduationCap,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            description: 'The title of the course',
            type: 'string',
            validation: (Rule) => Rule.required().error('El título es requerido')
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'A detailed description of the course',
            type: 'richText',
            validation: (Rule) => Rule.required().error('La descripción es requerida')
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            description: 'The main image for the course',
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Text',
                    description: 'Alternative text for screen readers and SEO'
                })
            ],
            options: {
                hotspot: true
            },
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'The URL slug for this course',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: (Rule) => Rule.required().error('El slug es requerido')
        }),
        defineField({
            name: 'fechasCapacitacion',
            title: 'Fechas de Capacitación',
            description: 'Add one or more training dates for this course',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'fechaCapacitacion',
                    title: 'Fecha de Capacitación',
                    fields: [
                        defineField({
                            name: 'nombre',
                            title: 'Nombre',
                            type: 'string',
                            description: 'Nombre de la capacitación',
                            validation: (Rule) => Rule.required().error('El nombre es requerido')
                        }),
                        defineField({
                            name: 'profesor',
                            title: 'Nombre del Profesor',
                            type: 'string',
                            description: 'Nombre del profesor que impartirá la capacitación',
                            options: {
                                list: [
                                    { title: 'Patricio Barahona', value: 'Patricio Barahona' },
                                    { title: 'Abraham Medina', value: 'Abraham Medina' }
                                ],
                                layout: 'radio'
                            },
                            validation: (Rule) => Rule.required().error('El nombre del profesor es requerido')
                        }),
                        defineField({
                            name: 'fecha',
                            title: 'Fecha',
                            type: 'date',
                            description: 'Fecha de la capacitación',
                            validation: (Rule) => Rule.required().error('La fecha es requerida')
                        }),
                        defineField({
                            name: 'hora',
                            title: 'Hora',
                            type: 'string',
                            description: 'Hora de la capacitación (ej: 09:00 - 13:00)',
                            validation: (Rule) => Rule.required().error('La hora es requerida')
                        })
                    ],
                    preview: {
                        select: {
                            title: 'nombre',
                            subtitle: 'profesor',
                            date: 'fecha',
                            time: 'hora'
                        },
                        prepare({ title, subtitle, date, time = '09:00 - 12:00 hrs.' }) {
                            return {
                                title: title,
                                subtitle: `${subtitle} - ${date} ${time}`
                            }
                        }
                    }
                }
            ]
        })
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image'
        }
    }
}) 