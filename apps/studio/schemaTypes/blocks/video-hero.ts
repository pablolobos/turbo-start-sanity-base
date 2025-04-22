import { Star } from "lucide-react";
import { defineField, defineType, ValidationContext } from "sanity";

import { buttonsField, richTextField } from "../common";
import { createRadioListLayout } from "../../utils/helper";

type VideoHeroParent = {
    videoType?: string;
}

export const videoHero = defineType({
    name: "videoHero",
    title: "Video Hero",
    icon: Star,
    type: "object",
    fields: [
        defineField({
            name: "variant",
            title: "Variante",
            type: "string",
            initialValue: "default",
            description: "Selecciona el estilo de fondo para este hero",
            options: createRadioListLayout(
                ["default", "alt", "accent1", "accent2", "brand"],
                { direction: "horizontal" }
            ),
        }),
        defineField({
            name: "badge",
            type: "string",
            title: "Badge",
        }),
        defineField({
            name: "title",
            type: "string",
            title: "Título",
        }),
        defineField({
            name: "titleFont",
            type: "string",
            title: "Fuente del Título",
            description: "Selecciona el estilo de fuente para el título",
            options: {
                list: [
                    { title: "Default", value: "default" },
                    { title: "Statement", value: "statement" },
                ],
                layout: "radio",
            },
            initialValue: "default",
        }),
        richTextField,
        defineField({
            name: "videoType",
            title: "Tipo de video",
            type: "string",
            description: "Selecciona el tipo de video a mostrar",
            options: {
                list: [
                    { title: "Video MP4", value: "mp4" },
                    { title: "Video de YouTube", value: "youtube" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required().error("Por favor selecciona un tipo de video"),
        }),
        defineField({
            name: "mp4File",
            type: "file",
            title: "Archivo de Video MP4",
            description: "Asegúrate de que el video esté optimizado y tenga un tamaño de archivo bajo",
            hidden: ({ parent }: { parent?: VideoHeroParent }) => parent?.videoType !== "mp4",
            validation: (Rule) =>
                Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as VideoHeroParent;
                    if (parent?.videoType === "mp4" && !value) {
                        return "El archivo de video es requerido cuando el tipo de video es MP4";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "youtubeUrl",
            title: "URL del video de YouTube",
            type: "url",
            description: "URL del video de YouTube",
            hidden: ({ parent }: { parent?: VideoHeroParent }) => parent?.videoType !== "youtube",
            validation: (Rule) =>
                Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as VideoHeroParent;
                    if (parent?.videoType === "youtube" && !value) {
                        return "La URL de YouTube es requerida cuando el tipo de video es YouTube";
                    }
                    if (value && !value.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
                        return "Debe ser una URL válida de YouTube";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "posterImage",
            type: "image",
            title: "Imagen de Portada",
            description: "Imagen opcional para mostrar mientras se carga el video",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "showControls",
            title: "Mostrar controles",
            type: "string",
            description: "Mostrar controles del reproductor",
            options: {
                list: [
                    { title: "Sí", value: "yes" },
                    { title: "No", value: "no" },
                ],
                layout: "radio",
            },
            initialValue: "yes",
        }),
        defineField({
            name: "autoplay",
            title: "Reproducción automática",
            type: "string",
            description: "Habilitar reproducción automática",
            options: {
                list: [
                    { title: "Sí", value: "yes" },
                    { title: "No", value: "no" },
                ],
                layout: "radio",
            },
            initialValue: "no",
        }),
        defineField({
            name: "loop",
            title: "Reproducción en bucle",
            type: "string",
            description: "Habilitar reproducción en bucle",
            options: {
                list: [
                    { title: "Sí", value: "yes" },
                    { title: "No", value: "no" },
                ],
                layout: "radio",
            },
            initialValue: "no",
        }),
        buttonsField,
    ],
    preview: {
        select: {
            title: "title",
            variant: "variant",
            titleFont: "titleFont",
            videoType: "videoType",
            posterImage: "posterImage",
        },
        prepare: ({ title, variant, titleFont, videoType, posterImage }) => ({
            title,
            subtitle: `Video Hero - Variante: ${variant || "default"} - Fuente: ${titleFont || "default"} - Video: ${videoType}`,
            media: posterImage || Star,
        }),
    },
}); 