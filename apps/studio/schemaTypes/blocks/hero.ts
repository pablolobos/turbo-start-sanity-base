import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: Star,
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
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Bloque Hero",
    }),
  },
});
