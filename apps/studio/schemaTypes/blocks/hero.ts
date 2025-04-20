import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";
import { createRadioListLayout } from "../../utils/helper";

export const hero = defineType({
  name: "hero",
  title: "Hero",
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
      name: "image",
      type: "image",
      title: "Imagen",
      options: {
        hotspot: true,
      },
    }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
      titleFont: "titleFont",
    },
    prepare: ({ title, variant, titleFont }) => ({
      title,
      subtitle: `Bloque Hero - Variante: ${variant || "default"} - Fuente: ${titleFont || "default"}`,
    }),
  },
});
