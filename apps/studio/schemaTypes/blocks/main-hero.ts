import { Projector } from "lucide-react";
import { defineField, defineType, ValidationContext } from "sanity";

import { buttonsField, richTextField } from "../common";

type MainHeroDocument = {
    backgroundType?: 'image' | 'video';
};

export const mainHero = defineType({
    name: "mainHero",
    title: "Hero Principal",
    icon: Projector,
    type: "object",
    fields: [
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
        defineField({
            name: "layout",
            type: "string",
            title: "Diseño de Layout",
            description: "Selecciona el tipo de layout para el hero",
            options: {
                list: [
                    { title: "Default", value: "default" },
                    { title: "Imagen Completa", value: "fullImage" },
                ],
                layout: "radio",
            },
            initialValue: "default",
        }),
        richTextField,
        defineField({
            name: "backgroundType",
            type: "string",
            title: "Tipo de Fondo",
            options: {
                list: [
                    { title: "Imagen", value: "image" },
                    { title: "Video", value: "video" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "backgroundImage",
            type: "image",
            title: "Imagen de Fondo",
            options: {
                hotspot: true,
            },
            hidden: ({ parent }) => parent?.backgroundType !== "image",
        }),
        defineField({
            name: "backgroundVideo",
            type: "file",
            title: "Video de Fondo",
            description: "Asegúrate de que el video esté optimizado y tenga un tamaño de archivo bajo",
            hidden: ({ parent }) => parent?.backgroundType !== "video",
            validation: (Rule) =>
                Rule.custom((value, context: ValidationContext) => {
                    if ((context.parent as { backgroundType?: string })?.backgroundType === "video" && !value) {
                        return "El video es obligatorio cuando el tipo de fondo es video";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Imagen de Portada",
            description: "Imagen opcional para mostrar mientras se carga el video",
            options: {
                hotspot: true,
            },
        }),
        buttonsField,
    ],
    preview: {
        select: {
            title: "title",
            backgroundType: "backgroundType",
            titleFont: "titleFont",
            layout: "layout",
        },
        prepare: ({ title, backgroundType, titleFont, layout }) => ({
            title,
            subtitle: `Bloque Hero Principal (${backgroundType}) - Fuente: ${titleFont || "default"} - Layout: ${layout || "default"}`,
        }),
    },
});