import { CogIcon } from "lucide-react";
import { defineField, defineType, defineArrayMember } from "sanity";

const socialLinks = defineField({
  name: "socialLinks",
  title: "Enlaces de Redes Sociales",
  description: "Añade enlaces a tus perfiles de redes sociales",
  type: "object",
  options: {},
  fields: [
    defineField({
      name: "linkedin",
      title: "URL de LinkedIn",
      description: "URL completa a tu perfil/página de empresa en LinkedIn",
      type: "string",
    }),
    defineField({
      name: "facebook",
      title: "URL de Facebook",
      description: "URL completa a tu perfil/página de Facebook",
      type: "string",
    }),
    defineField({
      name: "twitter",
      title: "URL de Twitter/X",
      description: "URL completa a tu perfil de Twitter/X",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "URL de Instagram",
      description: "URL completa a tu perfil de Instagram",
      type: "string",
    }),
    defineField({
      name: "youtube",
      title: "URL de YouTube",
      description: "URL completa a tu canal de YouTube",
      type: "string",
    }),
  ],
});

export const settings = defineType({
  name: "settings",
  type: "document",
  title: "Configuración",
  description: "Configuración global y ajustes para tu sitio web",
  icon: CogIcon,
  groups: [
    {
      name: "general",
      title: "General",
      default: true,
    },
    {
      name: "social",
      title: "Redes Sociales",
    },
    {
      name: "cotizador",
      title: "Cotizador",
    },
    {
      name: "contact",
      title: "Contacto",
    },
  ],
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Settings",
      title: "Etiqueta",
      description: "Etiqueta utilizada para identificar la configuración en el CMS",
      validation: (rule) => rule.required(),
      group: "general",
    }),
    defineField({
      name: "siteTitle",
      type: "string",
      title: "Título del Sitio",
      description:
        "El título principal de tu sitio web, utilizado en pestañas del navegador y SEO",
      validation: (rule) => rule.required(),
      group: "general",
    }),
    defineField({
      name: "siteDescription",
      type: "text",
      title: "Descripción del Sitio",
      description: "Una breve descripción de tu sitio web para propósitos de SEO",
      validation: (rule) => rule.required().min(50).max(160),
      group: "general",
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Logo del Sitio",
      description: "Sube el logo de tu sitio web",
      options: {
        hotspot: true,
      },
      group: "general",
    }),
    defineField({
      name: "contactEmail",
      type: "string",
      title: "Email de Contacto",
      description: "Dirección de email principal de contacto para tu sitio web",
      validation: (rule) => rule.email(),
      group: "general",
    }),
    defineField({
      name: "socialLinks",
      title: "Enlaces Sociales",
      type: "object",
      fields: socialLinks.fields,
      group: "social",
    }),
    defineField({
      name: "cotizadorFormTitle",
      title: "Título del Formulario de Cotización",
      type: "string",
      description: "Título que se mostrará en el formulario de cotización",
      group: "cotizador",
    }),
    defineField({
      name: "cotizadorFormDescription",
      title: "Descripción del Formulario",
      type: "text",
      description: "Breve descripción del propósito del formulario de cotización",
      group: "cotizador",
    }),
    defineField({
      name: "cotizadorForm",
      title: "Formulario de Cotización",
      description: "Seleccione el formulario que se utilizará para cotizaciones",
      type: "reference",
      to: [{ type: "formularios" }],
      validation: (rule) =>
        rule.required().error("Debe seleccionar un formulario para cotizaciones"),
      group: "cotizador",
    }),
    defineField({
      name: "customerServicePhone",
      type: "string",
      title: "Teléfono Servicio al Cliente",
      description: "Número de teléfono para servicio al cliente",
      group: "contact",
    }),
    defineField({
      name: "roadEmergencyPhone",
      type: "string",
      title: "Teléfono Emergencia en Ruta",
      description: "Número de teléfono principal para emergencias en ruta",
      group: "contact",
    }),
    defineField({
      name: "roadEmergencyPhone2",
      type: "string",
      title: "Teléfono Emergencia en Ruta 2",
      description: "Número de teléfono secundario para emergencias en ruta",
      group: "contact",
    }),
    defineField({
      name: "contactPageUrl",
      type: "object",
      title: "Página de Contacto",
      description: "URL de la página de contacto",
      group: "contact",
      fields: [
        defineField({
          name: "type",
          title: "Tipo de URL",
          type: "string",
          options: {
            list: [
              { title: "Página Interna", value: "internal" },
              { title: "URL Externa", value: "external" },
            ],
          },
          initialValue: "internal",
        }),
        defineField({
          name: "internal",
          title: "Página Interna",
          type: "reference",
          to: [{ type: "page" }],
          hidden: ({ parent }) => parent?.type !== "internal",
        }),
        defineField({
          name: "external",
          title: "URL Externa",
          type: "url",
          hidden: ({ parent }) => parent?.type !== "external",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title: title || "Configuración sin título",
      media: CogIcon,
    }),
  },
});
