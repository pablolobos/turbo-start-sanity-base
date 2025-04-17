import { ListIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productListing = defineType({
    name: "productListing",
    title: "Listado de Productos",
    type: "object",
    icon: ListIcon,
    description: "Bloque para mostrar productos filtrados por su taxonomía",
    fields: [
        defineField({
            name: "title",
            title: "Título",
            type: "string",
            description: "Título opcional para la sección de productos",
        }),
        defineField({
            name: "productType",
            title: "Tipo de Producto",
            type: "string",
            description: "Selecciona qué tipo de productos quieres mostrar",
            options: {
                list: [
                    { title: "Camiones", value: "camiones" },
                    { title: "Buses", value: "buses" },
                    { title: "Motores Penta", value: "motoresPenta" }
                ],
                layout: "radio"
            },
            validation: (Rule) => Rule.required().error("Debes seleccionar un tipo de producto"),
        }),
        defineField({
            name: "taxonomyFilter",
            title: "Filtro por Taxonomía",
            type: "reference",
            to: [{ type: "skosConcept" }],
            description: "Selecciona la categoría de productos a mostrar",
            options: {
                disableNew: true,
            },
            validation: (Rule) => Rule.required().error("Debes seleccionar una taxonomía"),
        })
    ],
    preview: {
        select: {
            title: "title",
            productType: "productType",
            taxonomy: "taxonomyFilter.prefLabel"
        },
        prepare: ({ title, productType, taxonomy }) => ({
            title: title || "Listado de Productos",
            subtitle: `${productType ? `${productType} • ` : ""}${taxonomy || "Sin taxonomía"}`
        })
    }
});