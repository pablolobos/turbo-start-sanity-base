import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";
import { createRadioListLayout } from "../../utils/helper";

export const doubleHero = defineType({
    name: "doubleHero",
    title: "Double Hero",
    icon: Star,
    type: "object",
    groups: [
        { name: "primary", title: "Contenido 1" },
        { name: "secondary", title: "Contenido 2" },
        { name: "style", title: "Estilo" },
    ],
    fields: [
        defineField({
            name: "variant",
            title: "Variante",
            type: "string",
            group: "style",
            initialValue: "default",
            description: "Selecciona el estilo de fondo para este hero",
            options: createRadioListLayout(
                ["default", "alt", "accent1", "accent2", "brand"],
                { direction: "horizontal" }
            ),
        }),
        // Primary Content
        defineField({
            name: "primaryBadge",
            type: "string",
            title: "Badge Principal",
            group: "primary",
        }),
        defineField({
            name: "primaryTitle",
            type: "string",
            title: "Título Principal",
            group: "primary",
        }),
        defineField({
            name: "primaryRichText",
            type: "array",
            title: "Contenido 1",
            group: "primary",
            of: [{ type: 'block' }],
        }),
        defineField({
            name: "primaryImage",
            type: "image",
            title: "Imagen Principal",
            group: "primary",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "primaryButtons",
            type: "array",
            title: "Botones Principales",
            group: "primary",
            of: buttonsField.of,
        }),
        // Secondary Content
        defineField({
            name: "secondaryBadge",
            type: "string",
            title: "Badge Secundario",
            group: "secondary",
        }),
        defineField({
            name: "secondaryTitle",
            type: "string",
            title: "Título Secundario",
            group: "secondary",
        }),
        defineField({
            name: "secondaryRichText",
            type: "array",
            title: "Contenido 2",
            group: "secondary",
            of: [{ type: 'block' }],
        }),
        defineField({
            name: "secondaryImage",
            type: "image",
            title: "Imagen Secundaria",
            group: "secondary",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "secondaryButtons",
            type: "array",
            title: "Botones Secundarios",
            group: "secondary",
            of: buttonsField.of,
        }),
    ],
    preview: {
        select: {
            primaryTitle: "primaryTitle",
            secondaryTitle: "secondaryTitle",
            variant: "variant",
        },
        prepare: ({ primaryTitle, secondaryTitle, variant }) => ({
            title: `${primaryTitle} | ${secondaryTitle}`,
            subtitle: `Bloque Double Hero - Variante: ${variant || "default"}`,
        }),
    },
}); 