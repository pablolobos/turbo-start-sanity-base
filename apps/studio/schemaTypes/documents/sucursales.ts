import { defineField, defineType } from 'sanity';
import { MapPin } from 'lucide-react';

export const sucursales = defineType({
    name: 'sucursales',
    title: 'Sucursales',
    type: 'document',
    icon: MapPin,
    fields: [
        defineField({
            name: 'title',
            title: 'Nombre de Sucursal',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'region',
            title: 'Región',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'telefono',
            title: 'Teléfono',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.email(),
        }),
        defineField({
            name: 'direccion',
            title: 'Dirección',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'latitud',
            title: 'Latitud',
            type: 'number',
            description: 'Coordenada de latitud para el mapa',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'longitud',
            title: 'Longitud',
            type: 'number',
            description: 'Coordenada de longitud para el mapa',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'personas',
            title: 'Personas',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'persona',
                    title: 'Persona',
                    fields: [
                        {
                            name: 'nombre',
                            title: 'Nombre',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'cargo',
                            title: 'Cargo',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'telefono',
                            title: 'Teléfono',
                            type: 'string',
                        },
                        {
                            name: 'email',
                            title: 'Email',
                            type: 'string',
                            validation: (Rule) => Rule.email(),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'nombre',
                            subtitle: 'cargo',
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'region',
        },
    },
}); 