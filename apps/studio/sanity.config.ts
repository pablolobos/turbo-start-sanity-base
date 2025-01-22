import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media } from "sanity-plugin-media";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { createPagesNavigator } from "./components/navigator/page-navigator";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { createPageTemplate } from "./utils/helper";

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
    presentationTool({
      components: {
        unstable_navigator: {
          component: createPagesNavigator(),
          minWidth: 350,
          maxWidth: 350,
        },
      },
      previewUrl: {
        origin: presentationOriginUrl,
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    structureTool({
      structure: structure,
    }),
    visionTool(),
    iconPicker(),
    media(),
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
    templates: createPageTemplate(),
  },
});
