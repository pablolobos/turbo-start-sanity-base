import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
console.log("🚀 ~ dataset:", dataset);
const host = process.env.HOST_NAME;
// const title = process.env.SANITY_STUDIO_TITLE;
// const presentationUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset,
  },
  studioHost:
    host && host !== "main"
      ? `${host}-roboto-next-sanity-template`
      : "roboto-next-sanity-template",
  autoUpdates: false,
});
