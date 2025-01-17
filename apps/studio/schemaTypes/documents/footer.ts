import { defineField, defineType } from "sanity";

const footerColumnLink = defineField({
  name: "footerColumnLink",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "Name for the link",
    }),
    defineField({
      name: "url",
      type: "customUrl",
    }),
  ],
});

const footerColumn = defineField({
  name: "footerColumn",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Title for the column",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      description: "Links for the column",
      of: [footerColumnLink],
    }),
  ],
});

export const footer = defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  description: "Footer content for your website",
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Footer",
      title: "Label",
      description: "Label used to identify footer in the CMS",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "text",
      rows: 2,
      title: "Subtitle",
      description:
        "Subtitle that sits beneath the logo in the footer",
    }),
    defineField({
      name: "columns",
      type: "array",
      title: "Columns",
      description: "Columns for the footer",
      of: [footerColumn],
    }),
  ],
  preview: {
    select: {
      title: "label",
    },
  },
});
