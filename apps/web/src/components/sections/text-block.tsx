import { cn } from "@workspace/ui/lib/utils";
import type { PagebuilderType } from "@/types";
import { RichText } from "../richtext";

type TextBlockProps = PagebuilderType<"textBlock"> & {
    className?: string;
};

export function TextBlock({ richText, className }: TextBlockProps) {
    if (!richText) return null;

    return (
        <section className={cn("mx-auto padding-center max-w-4xl section-y-padding", className)}>
            <div className="mx-auto max-w-prose">
                <RichText richText={richText} className="text-base md:text-lg" />
            </div>
        </section>
    );
} 