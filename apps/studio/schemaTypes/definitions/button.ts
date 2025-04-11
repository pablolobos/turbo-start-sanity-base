import { Command } from "lucide-react";
import { defineField, defineType } from "sanity";

import { capitalize, createRadioListLayout } from "../../utils/helper";

const buttonVariants = ["default", "primary", "secondary", "outline", "link"];
const iconOptions = ["volvo-chevron-right"];

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
      type: "customUrl",
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
      openInNewTab: "url.openInNewTab",
    },
    prepare: ({
      title,
      variant,
      icon,
      externalUrl,
      urlType,
      internalUrl,
      openInNewTab,
    }) => {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;
      const iconIndicator = icon ? ` [${icon}]` : '';

      return {
        title: title || "Botón sin título",
        subtitle: `${capitalize(variant ?? "default")}${iconIndicator} • ${truncatedUrl}${newTabIndicator}`,
      };
    },
  },
});
