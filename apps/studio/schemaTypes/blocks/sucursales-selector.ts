import { defineField, defineType } from 'sanity'
import { MapPin } from 'lucide-react'

export const sucursalesSelector = defineType({
    name: 'sucursalesSelector',
    title: 'Selector de Sucursales',
    type: 'object',
    icon: MapPin,
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            description: 'Título principal para la sección de sucursales',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            description: 'Texto descriptivo para la sección de sucursales',
        }),
        defineField({
            name: 'showMap',
            title: 'Mostrar Mapa',
            type: 'boolean',
            description: 'Mostrar un mapa con las ubicaciones de las sucursales',
            initialValue: true,
        }),
        defineField({
            name: 'showAllRegions',
            title: 'Mostrar todas las regiones',
            type: 'boolean',
            description: 'Si está habilitado, mostrará todas las regiones. Si está deshabilitado, solo mostrará las regiones específicas seleccionadas a continuación.',
            initialValue: true,
        }),
        defineField({
            name: 'selectedRegions',
            title: 'Regiones seleccionadas',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Seleccione las regiones específicas para mostrar (solo se aplica si "Mostrar todas las regiones" está deshabilitado)',
            hidden: ({ parent }) => parent?.showAllRegions === true,
        }),
        defineField({
            name: 'variant',
            title: 'Variante de diseño',
            type: 'string',
            options: {
                list: [
                    { title: 'Default', value: 'default' },
                    { title: 'Cards', value: 'cards' },
                    { title: 'Compact', value: 'compact' },
                ],
            },
            initialValue: 'default',
        }),
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare({ title }) {
            return {
                title: title || 'Selector de Sucursales',
                subtitle: 'Muestra sucursales por región',
                media: MapPin,
            }
        },
    },
}) 