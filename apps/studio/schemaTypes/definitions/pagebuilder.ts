import { defineArrayMember, defineType } from "sanity";

import { pageBuilderBlocks } from "../blocks";

export const pagebuilderBlockTypes = pageBuilderBlocks.map(({ name }) => ({
  type: name,
}));

export const pageBuilder = defineType({
  name: "pageBuilder",
  type: "array",
  of: pagebuilderBlockTypes.map((block) => defineArrayMember(block)),
  options: {
    insertMenu: {
      views: [
        {
          name: "grid",
          previewImageUrl: (schemaType) => {
            const baseUrl = process.env.SANITY_STUDIO_PRESENTATION_URL || 'http://localhost:3000';
            return `${baseUrl}/block-previews/${schemaType}.png`;
          },
        },
      ],
    },
  },
});
