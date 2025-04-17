import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  unsplashAssetSource,
  unsplashImageAsset,
} from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media, mediaAssetSource } from "sanity-plugin-media";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { createPageTemplate } from "./utils/helper";
import { inboxPlugin } from './plugins/inbox/plugin';
import { taxonomyManager } from 'sanity-plugin-taxonomy-manager'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const presentationOriginUrl = process.env.

  SANITY_STUDIO_PRESENTATION_URL?.replace(/\/$/, '');

export default defineConfig({
  name: "default",
  title: "Volvochile",
  projectId: projectId,
  icon: Logo,
  dataset: dataset ?? "production",
  plugins: [
    structureTool({
      structure,
    }),
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: presentationOriginUrl ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    assist(),
    visionTool(),
    iconPicker(),
    media(),
    presentationUrl(),
    unsplashImageAsset(),
    inboxPlugin(),
    taxonomyManager({
      // Optional: Set a Base URI to use for new concepts & concept schemes
      baseUri: 'https://volvochile.cl/',
      // Optional: Use `customConceptFields` and `customSchemeFields` keys to add custom fields to Concept or Concept Scheme document types
      customConceptFields: [
        {
          name: 'sameAs',
          title: 'Same As',
          type: 'url',
          description:
            'Specify a fully qualified IRI that identifies the same concept in another vocabulary',
        },
      ],
    }),
  ],

  form: {
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) =>
            assetSource === mediaAssetSource ||
            assetSource === unsplashAssetSource,
        );
      },
    },
  },
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
