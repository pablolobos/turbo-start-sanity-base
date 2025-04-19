import { BusIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { richTextField } from "../common";
import { pageBuilderField } from "../common";
import { branchFilter } from 'sanity-plugin-taxonomy-manager'
import { ReferenceHierarchyInput } from 'sanity-plugin-taxonomy-manager'

export const buses = defineType({
    name: "buses",
    title: "Buses",
    type: "document",
    icon: BusIcon,
    description:
        "Catálogo de buses Volvo. Cada entrada representa un modelo específico con sus características y detalles.",
    groups: GROUPS,
    fields: [
        defineField({
            name: "title",
            type: "string",
            title: "Título",
            description: "Nombre o modelo del bus",
            group: GROUP.MAIN_CONTENT,
            validation: (Rule) => Rule.required().error("El título es obligatorio"),
        }),
        defineField({
            name: "subtitle",
            type: "string",
            title: "Subtítulo",
            description: "Subtítulo del bus",
            group: GROUP.MAIN_CONTENT,
        }),
        defineField({
            name: "description",
            type: "text",
            title: "Descripción",
            description:
                "Breve descripción del bus que aparecerá en los resultados de búsqueda y vistas previas",
            rows: 3,
            group: GROUP.MAIN_CONTENT,
            validation: (rule) => [
                rule
                    .min(140)
                    .warning(
                        "La descripción debe tener al menos 140 caracteres para optimizar la visibilidad en resultados de búsqueda",
                    ),
                rule
                    .max(160)
                    .warning(
                        "La descripción no debe exceder los 160 caracteres ya que será truncada en los resultados de búsqueda",
                    ),
            ],
        }),
        defineField({
            name: 'taxonomias',
            title: 'Taxonomias',
            group: GROUP.MAIN_CONTENT,
            type: 'reference',
            to: { type: 'skosConcept' },
            options: {
                filter: branchFilter({ schemeId: '4bb257', branchId: 'cff000' }),
                disableNew: true,
            },
            components: { field: ReferenceHierarchyInput },
        }),
        defineField({
            name: "slug",
            type: "slug",
            title: "URL",
            description:
                "La dirección web para este bus (por ejemplo, '/buses/volvo-9800' creará una página en tudominio.com/buses/volvo-9800)",
            group: GROUP.MAIN_CONTENT,
            components: {
                field: PathnameFieldComponent,
            },
            options: {
                source: "title",
                slugify: createSlug,
                isUnique,
            },
            validation: (Rule) => [
                Rule.required().error("La URL es obligatoria"),
                Rule.custom((value, context) => {
                    if (!value?.current) return true;
                    if (!value.current.startsWith("/buses/")) {
                        return 'La URL debe comenzar con "/buses/"';
                    }
                    return true;
                }),
            ],
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Imagen Principal",
            description:
                "Imagen principal del bus que se usará en listados y redes sociales",
            group: GROUP.MAIN_CONTENT,
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            ...richTextField,
            description: "Contenido detallado sobre el bus y sus características",
            group: GROUP.MAIN_CONTENT,
        }),
        pageBuilderField,
        ...seoFields,
        ...ogFields,
    ],
    preview: {
        select: {
            title: "title",
            media: "image",
            slug: "slug.current",
            category: "category",
        },
        prepare: ({ title, media, slug, category }) => {
            return {
                title: title || "Bus sin título",
                subtitle: `🚌 ${category ? `${category} • ` : ""}${slug || "sin-url"}`,
                media,
            };
        },
    },
}); 