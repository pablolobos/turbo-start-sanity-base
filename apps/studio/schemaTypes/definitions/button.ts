import { Command } from "lucide-react";
import { defineField, defineType } from "sanity";

import { capitalize, createRadioListLayout } from "../../utils/helper";

const buttonVariants = ["default", "primary", "secondary", "outline", "link"];
const iconOptions = ["volvo-chevron-right", "volvo-file-down"];

export const button = defineType({
  name: "button",
  title: "Botón",
  type: "object",
  icon: Command,
  fields: [
    defineField({
      name: "variant",
      title: "Variante",
      type: "string",
      initialValue: () => "default",
      options: createRadioListLayout(buttonVariants, {
        direction: "horizontal",
      }),
    }),
    defineField({
      name: "text",
      title: "Texto del Botón",
      type: "string",
    }),
    defineField({
      name: "icon",
      title: "Ícono del Botón",
      type: "string",
      options: {
        list: iconOptions.map(icon => ({ title: capitalize(icon.replace(/-/g, ' ')), value: icon })),
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "object",
      fields: [
        defineField({
          name: "type",
          title: "Tipo de URL",
          type: "string",
          options: {
            list: [
              { title: "Página Interna", value: "internal" },
              { title: "URL Externa", value: "external" },
              { title: "Archivo", value: "file" },
            ],
            layout: "radio",
          },
          initialValue: "internal",
        }),
        defineField({
          name: "internal",
          title: "Página Interna",
          type: "reference",
          to: [
            { type: "page" },
            { type: "blog" },
            { type: "blogIndex" },
            { type: "camiones" },
            { type: "buses" },
            { type: "motoresPenta" },
          ],
          hidden: ({ parent }) => parent?.type !== "internal",
        }),
        defineField({
          name: "external",
          title: "URL Externa",
          type: "url",
          hidden: ({ parent }) => parent?.type !== "external",
        }),
        defineField({
          name: "file",
          title: "Archivo",
          type: "file",
          hidden: ({ parent }) => parent?.type !== "file",
          options: {
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          }
        }),
        defineField({
          name: "openInNewTab",
          title: "Abrir en Nueva Pestaña",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "text",
      variant: "variant",
      icon: "icon",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      fileUrl: "url.file.asset.url",
      openInNewTab: "url.openInNewTab",
    },
    prepare: ({
      title,
      variant,
      icon,
      externalUrl,
      urlType,
      internalUrl,
      fileUrl,
      openInNewTab,
    }) => {
      const url = urlType === "external" ? externalUrl :
        urlType === "file" ? fileUrl :
          internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;
      const iconIndicator = icon ? ` [${icon}]` : '';
      const typeIndicator = urlType === "file" ? " [Archivo]" : "";

      return {
        title: title || "Botón sin título",
        subtitle: `${capitalize(variant ?? "default")}${iconIndicator} • ${truncatedUrl}${newTabIndicator}${typeIndicator}`,
      };
    },
  },
});
