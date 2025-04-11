import { Projector } from "lucide-react";
import { defineField, defineType, ValidationContext } from "sanity";

import { buttonsField, richTextField } from "../common";

type MainHeroDocument = {
    backgroundType?: 'image' | 'video';
};

export const mainHero = defineType({
    name: "mainHero",
    title: "Main Hero",
    icon: Projector,
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
            title: "Title",
        }),
        richTextField,
        defineField({
            name: "backgroundType",
            type: "string",
            title: "Background Type",
            options: {
                list: [
                    { title: "Image", value: "image" },
                    { title: "Video", value: "video" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "backgroundImage",
            type: "image",
            title: "Background Image",
            options: {
                hotspot: true,
            },
            hidden: ({ parent }) => parent?.backgroundType !== "image",
        }),
        defineField({
            name: "backgroundVideo",
            type: "file",
            title: "Background Video",
            hidden: ({ parent }) => parent?.backgroundType !== "video",
            validation: (Rule) =>
                Rule.custom((value, context: ValidationContext) => {
                    if ((context.parent as { backgroundType?: string })?.backgroundType === "video" && !value) {
                        return "Video is required when background type is video";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Content Image",
            description: "Optional image to display alongside the content",
            options: {
                hotspot: true,
            },
        }),
        buttonsField,
    ],
    preview: {
        select: {
            title: "title",
            backgroundType: "backgroundType",
        },
        prepare: ({ title, backgroundType }) => ({
            title,
            subtitle: `Main Hero Block (${backgroundType})`,
        }),
    },
}); 