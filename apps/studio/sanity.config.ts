import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from "./structure";
import { iconPicker } from "sanity-plugin-icon-picker";
import { presentationUrl } from "./plugins/presentation-url";
import { presentationTool } from "sanity/presentation";
import { resolve } from "./resolve-presentation-document";
import { media } from "sanity-plugin-media";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const title = process.env.SANITY_STUDIO_TITLE ?? "";
const presentationOriginUrl =
  process.env.SANITY_STUDIO_PRESENTATION_URL ?? "";

export default defineConfig({
  name: "default",
  title: title,
  projectId: projectId,
  dataset: dataset,
  plugins: [
    structureTool({
      structure: structure,
    }),
    visionTool(),
    iconPicker(),
    media(),
    presentationTool({
      resolve: resolve,
      previewUrl: {
        origin: presentationOriginUrl,
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    presentationUrl(),
  ],
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  schema: {
    types: schemaTypes,
  },
});
