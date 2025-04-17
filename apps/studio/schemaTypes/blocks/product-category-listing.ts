import { ListFilterIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import type { StringFieldProps, StringSchemaType } from "sanity";

interface CategoryFieldProps extends StringFieldProps {
    parent?: {
        productType?: 'buses' | 'camiones' | 'motoresPenta';
    };
}

interface ParentContext {
    parent?: {
        productType?: 'buses' | 'camiones' | 'motoresPenta';
    };
}

const busCategories = [
    { title: "Urbano", value: "urbano" },
    { title: "Interurbano", value: "interurbano" },
];

const camionesCategories = [
    { title: "Larga distancia", value: "larga-distancia" },
    { title: "Construcción y minería", value: "construccion-y-mineria" },
    { title: "Forestal", value: "forestal" },
    { title: "Distribución Urbana y Regional", value: "distribucion-urbana-y-regional" },
    { title: "Volvo Electric", value: "volvo-electric" },
    { title: "Usados", value: "usados" },
];

const motoresPentaCategories = [
    { title: "Motores industriales", value: "motores-industriales" },
    { title: "Motores marinos", value: "motores-marinos" },
    { title: "Accesorios", value: "accesorios" },
];

export const productCategoryListing = defineType({
    name: "productCategoryListing",
    title: "Product Category Listing",
    type: "object",
    icon: ListFilterIcon,
    description: "Display a list of products filtered by type and category",
    fields: [
        defineField({
            name: "title",
            type: "string",
            title: "Title",
            description: "Main heading for the product listing section",
        }),
        defineField({
            name: "description",
            type: "text",
            title: "Description",
            description: "Optional description text to display above the product listing",
            rows: 3,
        }),
        defineField({
            name: "productType",
            type: "string",
            title: "Product Type",
            description: "Select which type of products to display",
            options: {
                list: [
                    { title: "Buses", value: "buses" },
                    { title: "Camiones", value: "camiones" },
                    { title: "Motores Penta", value: "motoresPenta" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required().error("Product type is required"),
        }),
        defineField({
            name: "category",
            type: "string",
            title: "Category",
            description: "Select the category to filter products",
            hidden: ({ parent }) => !parent?.productType,
            options: {
                list: [
                    ...busCategories,
                    ...camionesCategories,
                    ...motoresPentaCategories
                ]
            },
            validation: (Rule) =>
                Rule.required()
                    .error("Category is required")
                    .custom((category, context) => {
                        const { parent } = context as unknown as ParentContext;
                        if (!parent?.productType) return true;

                        const validCategories =
                            parent.productType === "buses" ? busCategories :
                                parent.productType === "camiones" ? camionesCategories :
                                    parent.productType === "motoresPenta" ? motoresPentaCategories :
                                        [];

                        return validCategories.some(c => c.value === category) ||
                            "Please select a valid category for the selected product type";
                    }),
        }),
        defineField({
            name: "displayMode",
            type: "string",
            title: "Display Mode",
            description: "Choose how to display the product listing",
            options: {
                list: [
                    { title: "Grid", value: "grid" },
                    { title: "List", value: "list" },
                ],
                layout: "radio",
            },
            initialValue: "grid",
        }),
        defineField({
            name: "showViewAllButton",
            type: "string",
            title: "Show View All Button",
            description: "Display a button to view all products in this category",
            options: {
                list: [
                    { title: "Yes", value: "yes" },
                    { title: "No", value: "no" },
                ],
                layout: "radio",
            },
            initialValue: "yes",
        }),
        defineField({
            name: "viewAllButtonText",
            type: "string",
            title: "View All Button Text",
            description: "Text to display on the view all button",
            initialValue: "Ver todos",
            hidden: ({ parent }) => parent?.showViewAllButton !== "yes",
        }),
    ],
    preview: {
        select: {
            title: "title",
            productType: "productType",
            category: "category",
        },
        prepare: ({ title, productType, category }) => ({
            title: title || "Product Category Listing",
            subtitle: `${productType ? `${productType} • ` : ""}${category || "No category selected"}`,
        }),
    },
}); 