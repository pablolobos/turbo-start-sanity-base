import { RichText } from "@/components/richtext";
import type { PortableTextBlock } from "next-sanity";

interface InfoSectionProps {
    title: string
    headingLevel: 'h1' | 'h2' | 'h3' | 'h4'
    content: PortableTextBlock[]
}

export function InfoSection({ title, headingLevel, content }: InfoSectionProps) {
    const Heading = headingLevel

    return (
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 py-12 lg:py-20 container-padding padding-center max-container">
            <Heading className="mb-4 font-semibold text-4xl capitalize">
                {title}
            </Heading>
            <div className="dark:prose-invert text-base prose prose-neutral">
                <RichText richText={content} />
            </div>
        </div>
    )
} 