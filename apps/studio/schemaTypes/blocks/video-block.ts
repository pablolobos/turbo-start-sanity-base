import { defineField, defineType, ValidationContext } from 'sanity'
import { PlayIcon } from '@sanity/icons'

type VideoBlockParent = {
    videoType?: string;
}

export const videoBlock = defineType({
    name: 'videoBlock',
    title: 'Bloque de Video',
    type: 'object',
    icon: PlayIcon,
    groups: [
        {
            name: 'content',
            title: 'Contenido',
            default: true,
        },
        {
            name: 'settings',
            title: 'Configuración del Reproductor',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            description: 'Título para el bloque de video (opcional)',
            group: 'content',
        }),
        defineField({
            name: 'videoType',
            title: 'Tipo de video',
            type: 'string',
            description: 'Selecciona el tipo de video a mostrar',
            options: {
                list: [
                    { title: 'Video MP4', value: 'mp4' },
                    { title: 'Video de YouTube', value: 'youtube' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required().error('Por favor selecciona un tipo de video'),
            group: 'content',
        }),
        defineField({
            name: 'mp4File',
            type: 'file',
            title: 'Archivo de Video MP4',
            description: 'Asegúrate de que el video esté optimizado y tenga un tamaño de archivo bajo',
            hidden: ({ parent }: { parent?: VideoBlockParent }) => parent?.videoType !== 'mp4',
            validation: (Rule) =>
                Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as VideoBlockParent;
                    if (parent?.videoType === 'mp4' && !value) {
                        return 'El archivo de video es requerido cuando el tipo de video es MP4'
                    }
                    return true
                }),
            group: 'content',
        }),
        defineField({
            name: 'youtubeUrl',
            title: 'URL del video de YouTube',
            type: 'url',
            description: 'URL del video de YouTube',
            hidden: ({ parent }: { parent?: VideoBlockParent }) => parent?.videoType !== 'youtube',
            validation: (Rule) =>
                Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as VideoBlockParent;
                    if (parent?.videoType === 'youtube' && !value) {
                        return 'La URL de YouTube es requerida cuando el tipo de video es YouTube'
                    }
                    if (value && !value.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
                        return 'Debe ser una URL válida de YouTube'
                    }
                    return true
                }),
            group: 'content',
        }),
        defineField({
            name: 'showControls',
            title: 'Mostrar controles',
            type: 'string',
            description: 'Mostrar controles del reproductor',
            options: {
                list: [
                    { title: 'Sí', value: 'yes' },
                    { title: 'No', value: 'no' },
                ],
                layout: 'radio',
            },
            initialValue: 'yes',
            group: 'settings',
        }),
        defineField({
            name: 'autoplay',
            title: 'Reproducción automática',
            type: 'string',
            description: 'Habilitar reproducción automática',
            options: {
                list: [
                    { title: 'Sí', value: 'yes' },
                    { title: 'No', value: 'no' },
                ],
                layout: 'radio',
            },
            initialValue: 'no',
            group: 'settings',
        }),
        defineField({
            name: 'loop',
            title: 'Reproducción en bucle',
            type: 'string',
            description: 'Habilitar reproducción en bucle',
            options: {
                list: [
                    { title: 'Sí', value: 'yes' },
                    { title: 'No', value: 'no' },
                ],
                layout: 'radio',
            },
            initialValue: 'no',
            group: 'settings',
        }),
        defineField({
            name: 'allowFullscreen',
            title: 'Permitir pantalla completa',
            type: 'string',
            description: 'Permitir pantalla completa',
            options: {
                list: [
                    { title: 'Sí', value: 'yes' },
                    { title: 'No', value: 'no' },
                ],
                layout: 'radio',
            },
            initialValue: 'no',
            group: 'settings',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            videoType: 'videoType',
            mp4File: 'mp4File',
            youtubeUrl: 'youtubeUrl',
        },
        prepare({ title, videoType, mp4File, youtubeUrl }) {
            return {
                title: title || 'Bloque de Video',
                subtitle: videoType === 'mp4'
                    ? (mp4File?.asset?._ref || 'No hay archivo seleccionado')
                    : (youtubeUrl || 'No hay URL configurada'),
                media: PlayIcon,
            }
        },
    },
}) 