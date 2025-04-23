import { defineArrayMember, defineField, defineType } from "sanity";
import { Wrench } from "lucide-react";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const repuestosIndex = defineType({
    name: "repuestosIndex",
    type: "document",
    title: "Repuestos Listing Page",
    icon: Wrench,
    description:
        "Esta es la página principal que muestra todos los repuestos. Puedes personalizar cómo se ve tu página de listado de repuestos, qué título tiene y qué categorías deseas destacar.",
    groups: GROUPS,
    fields: [
        defineField({
            name: "title",
            type: "string",
            description:
                "El título principal que aparecerá en la parte superior de la página de listado de repuestos",
            group: GROUP.MAIN_CONTENT,
            validation: (Rule) => Rule.required().error("Se requiere un título para la página de repuestos"),
        }),
        defineField({
            name: "description",
            type: "text",
            description:
                "Un breve resumen de lo que los visitantes pueden encontrar en tu sección de repuestos. Esto ayuda a las personas a entender de qué se trata esta sección.",
            group: GROUP.MAIN_CONTENT,
            validation: (rule) => [
                rule
                    .min(50)
                    .warning(
                        "La descripción debería tener al menos 50 caracteres para proporcionar información suficiente"
                    ),
                rule
                    .max(160)
                    .warning(
                        "La descripción no debería exceder los 160 caracteres, ya que puede ser truncada en los resultados de búsqueda"
                    ),
            ],
        }),
        defineField({
            name: "slug",
            type: "slug",
            description:
                "La dirección web para tu página de repuestos (por ejemplo, '/repuestos' crearía una página en tudominio.com/repuestos)",
            group: GROUP.MAIN_CONTENT,
            options: {
                source: "title",
                slugify: createSlug,
                isUnique: isUnique,
            },
            validation: (Rule) => Rule.required().error("Se requiere un slug para la página de repuestos"),
        }),
        defineField({
            name: "displayFeaturedCategories",
            title: "Mostrar Categorías Destacadas",
            description:
                "Cuando está habilitado, esto mostrará categorías destacadas en la parte superior de la página",
            type: "string",
            options: {
                list: [
                    { title: "Sí", value: "yes" },
                    { title: "No", value: "no" },
                ],
                layout: "radio",
            },
            initialValue: "yes",
            group: GROUP.MAIN_CONTENT,
        }),
        defineField({
            name: "featuredCategoriesCount",
            title: "Número de Categorías Destacadas",
            description: "Selecciona el número de categorías para mostrar como destacadas.",
            type: "string",
            options: {
                list: [
                    { title: "1", value: "1" },
                    { title: "2", value: "2" },
                    { title: "3", value: "3" },
                    { title: "4", value: "4" },
                ],
                layout: "radio",
                direction: "horizontal",
            },
            initialValue: "3",
            hidden: ({ parent }) => parent?.displayFeaturedCategories !== "yes",
            group: GROUP.MAIN_CONTENT,
        }),
        defineField({
            name: "featuredCategories",
            title: "Categorías Destacadas",
            description: "Selecciona las categorías que quieres destacar en la página principal de repuestos",
            type: "array",
            of: [
                defineArrayMember({
                    type: "string",
                    options: {
                        list: [
                            'Lubricantes y refrigerantes',
                            'Filtros',
                            'Componentes de la cabina',
                            'Frenos',
                            'Componentes de la transmisión',
                            'Sistema de suspensión',
                            'Componentes de conducción',
                            'Motor',
                            'Componentes eléctricos'
                        ],
                    },
                }),
            ],
            hidden: ({ parent }) => parent?.displayFeaturedCategories !== "yes",
            validation: (Rule) =>
                Rule.custom((value, context) => {
                    const parent = context.parent as {
                        displayFeaturedCategories?: string;
                        featuredCategoriesCount?: string;
                    };

                    if (parent?.displayFeaturedCategories !== "yes") return true;
                    if (!value || !value.length) return "Selecciona al menos una categoría destacada";

                    const maxCategories = parseInt(parent?.featuredCategoriesCount || "3", 10);
                    if (value.length > maxCategories) {
                        return `Solo puedes seleccionar hasta ${maxCategories} categorías destacadas`;
                    }

                    return true;
                }),
            group: GROUP.MAIN_CONTENT,
        }),
        pageBuilderField,
        defineField({
            name: "repuestosPageBuilder",
            title: "Bloques para todas las páginas de repuestos",
            description: "Estos bloques aparecerán en todas las páginas de detalle de repuestos",
            type: "pageBuilder",
            group: GROUP.MAIN_CONTENT
        }),
        ...seoFields.filter(
            (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name),
        ),
        ...ogFields,
    ],
    preview: {
        select: {
            title: "title",
            description: "description",
            slug: "slug.current",
        },
        prepare: ({ title, description, slug }) => ({
            title: title || "Página de Repuestos",
            subtitle: description || slug || "Listado de Repuestos",
        }),
    },
}); 